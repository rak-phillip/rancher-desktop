import fs from 'fs';
import os from 'os';
import path from 'path';

import UnixIntegrationManager, { manageSymlink } from '@/integrations/unixIntegrationManager';

const INTEGRATION_DIR_NAME = 'integrationDir';
const TMPDIR_PREFIX = 'rdtest-';

const testUnix = os.platform() !== 'win32' ? test : test.skip;
const resourcesDir = path.join('resources', os.platform(), 'bin');
let testDir: string;
let integrationDir: string;
let dockerCliPluginDir: string;

// Creates integration directory and docker CLI plugin directory with
// relevant symlinks in them. Useful for testing removal parts
// of UnixIntegrationManager.
async function createTestSymlinks(resourcesDirectory: string, integrationDirectory: string, dockerCliPluginDirectory: string): Promise<void> {
  await fs.promises.mkdir(integrationDirectory, { recursive: true, mode: 0o755 });
  await fs.promises.mkdir(dockerCliPluginDirectory, { recursive: true, mode: 0o755 });

  const kubectlSrcPath = path.join(resourcesDirectory, 'kubectl');
  const kubectlDstPath = path.join(integrationDirectory, 'kubectl');

  await fs.promises.symlink(kubectlSrcPath, kubectlDstPath);

  const composeSrcPath = path.join(resourcesDirectory, 'docker-compose');
  const composeDstPath = path.join(integrationDirectory, 'docker-compose');

  await fs.promises.symlink(composeSrcPath, composeDstPath);

  const composeCliDstPath = path.join(dockerCliPluginDirectory, 'docker-compose');

  await fs.promises.symlink(composeDstPath, composeCliDstPath);
}

beforeEach(async() => {
  testDir = await fs.promises.mkdtemp(path.join(os.tmpdir(), TMPDIR_PREFIX));
  integrationDir = path.join(testDir, INTEGRATION_DIR_NAME);
  dockerCliPluginDir = path.join(testDir, 'dockerCliPluginDir');
});

afterEach(async() => {
  if (testDir.includes(TMPDIR_PREFIX)) {
    await fs.promises.rm(testDir, { recursive: true, force: true });
  }
});

testUnix('Ensure symlinks and dirs are created properly', async() => {
  const integrationManager = new UnixIntegrationManager(
    resourcesDir, integrationDir, dockerCliPluginDir);

  await integrationManager.enforce();
  expect(fs.promises.readdir(integrationDir)).resolves.not.toThrow();
  for (const name of await fs.promises.readdir(resourcesDir)) {
    const integrationPath = path.join(integrationDir, name);

    expect(fs.promises.readlink(integrationPath, 'utf8')).resolves.not.toThrow();
  }
  for (const name of await integrationManager.getDockerCliPluginNames()) {
    const pluginPath = path.join(dockerCliPluginDir, name);

    expect(fs.promises.readlink(pluginPath, 'utf8')).resolves.not.toThrow();
  }
});

testUnix('Ensure symlinks and dirs are removed properly', async() => {
  await createTestSymlinks(resourcesDir, integrationDir, dockerCliPluginDir);
  const integrationManager = new UnixIntegrationManager(
    resourcesDir, integrationDir, dockerCliPluginDir);

  await integrationManager.remove();
  expect(fs.promises.readdir(integrationDir)).rejects.toThrow();
  expect(fs.promises.readdir(dockerCliPluginDir)).resolves.toEqual([]);
});

testUnix('Existing docker CLI plugins should not be overwritten upon .enforce()', async() => {
  // create existing plugin
  const existingPluginPath = path.join(dockerCliPluginDir, 'docker-compose');
  const existingPluginContents = 'meaningless contents';

  await fs.promises.mkdir(dockerCliPluginDir, { mode: 0o755 });
  await fs.promises.writeFile(existingPluginPath, existingPluginContents);

  const integrationManager = new UnixIntegrationManager(
    resourcesDir, integrationDir, dockerCliPluginDir);

  await integrationManager.enforce();

  const newContents = await fs.promises.readFile(existingPluginPath, 'utf8');

  expect(newContents).toEqual(existingPluginContents);
});

testUnix('Existing docker CLI plugins should not be removed upon .remove()', async() => {
  // create existing plugin
  const existingPluginPath = path.join(dockerCliPluginDir, 'docker-compose');
  const existingPluginContents = 'meaningless contents';

  await fs.promises.mkdir(dockerCliPluginDir, { mode: 0o755 });
  await fs.promises.writeFile(existingPluginPath, existingPluginContents);

  const integrationManager = new UnixIntegrationManager(
    resourcesDir, integrationDir, dockerCliPluginDir);

  await integrationManager.remove();

  const newContents = await fs.promises.readFile(existingPluginPath, 'utf8');

  expect(newContents).toEqual(existingPluginContents);
});

testUnix('.enforce() should be idempotent', async() => {
  const integrationManager = new UnixIntegrationManager(
    resourcesDir, integrationDir, dockerCliPluginDir);

  await integrationManager.enforce();
  const intDirAfterFirstCall = await fs.promises.readdir(integrationDir);
  const dockerCliDirAfterFirstCall = await fs.promises.readdir(dockerCliPluginDir);

  await integrationManager.enforce();
  const intDirAfterSecondCall = await fs.promises.readdir(integrationDir);
  const dockerCliDirAfterSecondCall = await fs.promises.readdir(dockerCliPluginDir);

  expect(intDirAfterFirstCall).toEqual(intDirAfterSecondCall);
  expect(dockerCliDirAfterFirstCall).toEqual(dockerCliDirAfterSecondCall);
});

testUnix('.remove() should be idempotent', async() => {
  const integrationManager = new UnixIntegrationManager(
    resourcesDir, integrationDir, dockerCliPluginDir);

  await integrationManager.remove();
  const testDirAfterFirstCall = await fs.promises.readdir(testDir);

  expect(testDirAfterFirstCall).not.toContain(INTEGRATION_DIR_NAME);
  const dockerCliDirAfterFirstCall = await fs.promises.readdir(dockerCliPluginDir);

  expect(dockerCliDirAfterFirstCall).toEqual([]);

  await integrationManager.remove();
  const testDirAfterSecondCall = await fs.promises.readdir(testDir);

  expect(testDirAfterSecondCall).not.toContain(INTEGRATION_DIR_NAME);
  const dockerCliDirAfterSecondCall = await fs.promises.readdir(dockerCliPluginDir);

  expect(dockerCliDirAfterFirstCall).toEqual(dockerCliDirAfterSecondCall);
});

testUnix('.removeSymlinksOnly should remove symlinks but not integration directory', async() => {
  await createTestSymlinks(resourcesDir, integrationDir, dockerCliPluginDir);
  const integrationManager = new UnixIntegrationManager(
    resourcesDir, integrationDir, dockerCliPluginDir);

  await integrationManager.removeSymlinksOnly();
  await expect(fs.promises.readdir(integrationDir)).resolves.toEqual([]);
  await expect(fs.promises.readdir(dockerCliPluginDir)).resolves.toEqual([]);
});

testUnix("manageSymlink should create the symlink if it doesn't exist", async() => {
  const srcPath = path.join(resourcesDir, 'kubectl');
  const dstPath = path.join(testDir, 'kubectl');

  const dirContentsBefore = await fs.promises.readdir(testDir);

  expect(dirContentsBefore).toEqual([]);

  await manageSymlink(srcPath, dstPath, true);

  return fs.promises.readlink(dstPath);
});

testUnix('manageSymlink should do nothing if file is correct symlink', async() => {
  const srcPath = path.join(resourcesDir, 'kubectl');
  const dstPath = path.join(testDir, 'kubectl');

  await fs.promises.symlink(srcPath, dstPath);
  await manageSymlink(srcPath, dstPath, true);

  const newTarget = await fs.promises.readlink(dstPath);

  expect(newTarget).toEqual(srcPath);
});

testUnix('manageSymlink should correct a symlink with an incorrect target', async() => {
  // create a file to target in the bad symlink
  const badSrcDir = path.join(testDir, 'resources', os.platform(), 'bin');
  const badSrcPath = path.join(badSrcDir, 'fakeKubectl');
  const dstPath = path.join(testDir, 'kubectl');
  const srcPath = path.join(resourcesDir, 'kubectl');

  await fs.promises.mkdir(badSrcDir, { recursive: true, mode: 0o755 });
  await fs.promises.writeFile(badSrcPath, 'contents');
  await fs.promises.symlink(badSrcPath, dstPath);
  await manageSymlink(srcPath, dstPath, true);

  const newTarget = await fs.promises.readlink(dstPath);

  expect(newTarget).toEqual(srcPath);
});

testUnix("manageSymlink should not touch the file if it isn't a symlink", async() => {
  // create the non-symlink dst file
  const contents = 'these contents should be kept';
  const dstPath = path.join(testDir, 'kubectl');
  const srcPath = path.join(resourcesDir, 'kubectl');

  await fs.promises.writeFile(dstPath, contents);
  await manageSymlink(srcPath, dstPath, true);

  const newContents = await fs.promises.readFile(dstPath, 'utf8');

  expect(newContents).toEqual(contents);
});

testUnix("manageSymlink should not touch the file if it isn't a symlink we own", async() => {
  const oldSrcPath = path.join(testDir, 'fakeKubectl');
  const dstPath = path.join(testDir, 'kubectl');
  const srcPath = path.join(resourcesDir, 'kubectl');

  await fs.promises.writeFile(oldSrcPath, 'contents');
  await fs.promises.symlink(oldSrcPath, dstPath);
  await manageSymlink(srcPath, dstPath, true);

  const newTarget = await fs.promises.readlink(dstPath);

  expect(newTarget).toEqual(oldSrcPath);
});

testUnix("manageSymlink should not touch the file if custom string doesn't match", async() => {
  const oldSrcPath = path.join(testDir, 'resources', os.platform(), 'bin', 'fakeKubectl');
  const dstPath = path.join(testDir, 'kubectl');
  const srcPath = path.join(resourcesDir, 'kubectl');

  await fs.promises.symlink(oldSrcPath, dstPath);
  await manageSymlink(srcPath, dstPath, true, path.join('another', 'dir'));

  const newTarget = await fs.promises.readlink(dstPath);

  expect(newTarget).toEqual(oldSrcPath);
});

testUnix('manageSymlink should change the file if the custom string matches', async() => {
  const customString = path.join('another', 'dir');
  const oldSrcDir = path.join(testDir, customString);
  const oldSrcPath = path.join(oldSrcDir, 'fakeKubectl');
  const dstPath = path.join(testDir, 'kubectl');
  const srcPath = path.join(resourcesDir, 'kubectl');

  await fs.promises.mkdir(oldSrcDir, { recursive: true, mode: 0o755 });
  await fs.promises.symlink(oldSrcPath, dstPath);
  await manageSymlink(srcPath, dstPath, true, customString);

  const newTarget = await fs.promises.readlink(dstPath);

  expect(newTarget).toEqual(srcPath);
});

testUnix('manageSymlink should delete the file if the target path matches', async() => {
  const dstPath = path.join(testDir, 'kubectl');
  const srcPath = path.join(resourcesDir, 'kubectl');

  await fs.promises.symlink(srcPath, dstPath);
  await manageSymlink(srcPath, dstPath, false);

  return expect(fs.promises.readlink(dstPath)).rejects.toThrow();
});

testUnix("manageSymlink shouldn't delete the file if the target path doesn't match", async() => {
  const oldSrcPath = path.join(testDir, 'fakeKubectl');
  const dstPath = path.join(testDir, 'kubectl');
  const srcPath = path.join(resourcesDir, 'kubectl');

  await fs.promises.writeFile(oldSrcPath, 'contents');
  await fs.promises.symlink(oldSrcPath, dstPath);
  await manageSymlink(srcPath, dstPath, false);

  const newTarget = await fs.promises.readlink(dstPath);

  expect(newTarget).toEqual(oldSrcPath);
});

testUnix("manageSymlink shouldn't delete the file if it isn't a symlink", async() => {
  const oldContents = "shouldn't be changed";
  const dstPath = path.join(testDir, 'kubectl');
  const srcPath = path.join(resourcesDir, 'kubectl');

  await fs.promises.writeFile(dstPath, oldContents);
  await manageSymlink(srcPath, dstPath, false);

  const newContents = await fs.promises.readFile(dstPath, 'utf8');

  expect(newContents).toEqual(oldContents);
});

testUnix('manageSymlink should do nothing if file is not present', async() => {
  const dstPath = path.join(testDir, 'kubectl');
  const srcPath = path.join(resourcesDir, 'kubectl');

  const testDirContentsBefore = await fs.promises.readdir(testDir);

  expect(testDirContentsBefore).toEqual([]);
  await manageSymlink(srcPath, dstPath, false);
  const testDirContentsAfter = await fs.promises.readdir(testDir);

  return expect(testDirContentsAfter).toEqual([]);
});

testUnix("manageSymlink should not remove the file if custom string doesn't match", async() => {
  const oldSrcPath = path.join(testDir, 'resources', os.platform(), 'bin', 'fakeKubectl');
  const dstPath = path.join(testDir, 'kubectl');
  const srcPath = path.join(resourcesDir, 'kubectl');

  await fs.promises.symlink(oldSrcPath, dstPath);
  await manageSymlink(srcPath, dstPath, false, path.join('another', 'dir'));

  const newTarget = await fs.promises.readlink(dstPath);

  expect(newTarget).toEqual(oldSrcPath);
});

testUnix('manageSymlink should remove the file if the custom string matches', async() => {
  const customString = path.join('another', 'dir');
  const oldSrcPath = path.join(testDir, customString, 'fakeKubectl');
  const dstPath = path.join(testDir, 'kubectl');
  const srcPath = path.join(resourcesDir, 'kubectl');

  await fs.promises.symlink(oldSrcPath, dstPath);
  await manageSymlink(srcPath, dstPath, false, customString);

  return expect(fs.promises.readlink(dstPath)).rejects.toThrow();
});

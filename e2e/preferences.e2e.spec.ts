import os from 'os';
import path from 'path';

import { test, expect, _electron } from '@playwright/test';

import { NavPage } from './pages/nav-page';
import { PreferencesPage } from './pages/preferences';
import { createDefaultSettings, reportAsset, teardown } from './utils/TestUtils';

import type { ElectronApplication, BrowserContext, Page } from '@playwright/test';

let page: Page;

/**
 * Using test.describe.serial make the test execute step by step, as described on each `test()` order
 * Playwright executes test in parallel by default and it will not work for our app backend loading process.
 * */
test.describe.serial('Main App Test', () => {
  let electronApp: ElectronApplication;
  let context: BrowserContext;
  let preferencesWindow: Page;

  test.beforeAll(async() => {
    createDefaultSettings();

    electronApp = await _electron.launch({
      args: [
        path.join(__dirname, '../'),
        '--disable-gpu',
        '--whitelisted-ips=',
        // See pkg/rancher-desktop/utils/commandLine.ts before changing the next item as the final option.
        '--disable-dev-shm-usage',
        '--no-modal-dialogs',
      ],
      env: {
        ...process.env,
        RD_LOGS_DIR:     reportAsset(__filename, 'log'),
        RD_MOCK_BACKEND: '1',
      },
    });
    context = electronApp.context();

    await context.tracing.start({ screenshots: true, snapshots: true });
    page = await electronApp.firstWindow();

    await new NavPage(page).preferencesButton.click();

    preferencesWindow = await electronApp.waitForEvent('window', page => /preferences/i.test(page.url()));
  });

  test.afterAll(() => teardown(electronApp, __filename));

  test('should open preferences modal', async() => {
    expect(preferencesWindow).toBeDefined();

    // Wait for the window to actually load (i.e. transition from
    // app://index.html/#/preferences to app://index.html/#/Preferences#general)
    await preferencesWindow.waitForURL(/Preferences/);
  });

  test('should show application page and render general tab', async() => {
    const { application } = new PreferencesPage(preferencesWindow);

    await expect(application.nav).toHaveClass('preferences-nav-item active');

    if (!os.platform().startsWith('win')) {
      await expect(application.tabEnvironment).toBeVisible();
    } else {
      await expect(application.tabEnvironment).not.toBeVisible();
    }

    await expect(application.tabGeneral).toHaveText('General');
    await expect(application.tabBehavior).toBeVisible();

    await expect(application.automaticUpdates).toBeVisible();
    await expect(application.statistics).toBeVisible();
    await expect(application.autoStart).not.toBeVisible();
    await expect(application.pathManagement).not.toBeVisible();
  });

  test('should render behavior tab', async() => {
    const { application } = new PreferencesPage(preferencesWindow);

    await application.tabBehavior.click();

    await expect(application.autoStart).toBeVisible();
    await expect(application.background).toBeVisible();
    await expect(application.notificationIcon).toBeVisible();
    await expect(application.administrativeAccess).not.toBeVisible();
    await expect(application.pathManagement).not.toBeVisible();
  });

  test('should render environment tab', async() => {
    test.skip(os.platform() === 'win32', 'Environment tab not available on Windows');
    const { application } = new PreferencesPage(preferencesWindow);

    await application.tabEnvironment.click();

    await expect(application.administrativeAccess).not.toBeVisible();
    await expect(application.automaticUpdates).not.toBeVisible();
    await expect(application.statistics).not.toBeVisible();
    await expect(application.pathManagement).toBeVisible();
  });

  test('should render environment tab after close and reopen preferences modal', async() => {
    test.skip(os.platform() === 'win32', 'Environment tab not available on Windows');
    await preferencesWindow.close();

    await new NavPage(page).preferencesButton.click();
    preferencesWindow = await electronApp.waitForEvent('window', page => /preferences/i.test(page.url()));

    expect(preferencesWindow).toBeDefined();

    const { application } = new PreferencesPage(preferencesWindow);

    await expect(application.nav).toHaveClass('preferences-nav-item active');
    await expect(application.tabBehavior).toBeVisible();
    await expect(application.tabEnvironment).toBeVisible();
    await expect(application.administrativeAccess).not.toBeVisible();
    await expect(application.automaticUpdates).not.toBeVisible();
    await expect(application.statistics).not.toBeVisible();
    await expect(application.pathManagement).toBeVisible();
  });

  test('should navigate to virtual machine and render hardware tab', async() => {
    test.skip(os.platform() === 'win32', 'Virtual Machine not available on Windows');
    const { virtualMachine, application } = new PreferencesPage(preferencesWindow);

    await virtualMachine.nav.click();

    await expect(application.nav).toHaveClass('preferences-nav-item');
    await expect(virtualMachine.nav).toHaveClass('preferences-nav-item active');

    await expect(virtualMachine.tabHardware).toHaveText('Hardware');
    await expect(virtualMachine.tabVolumes).toBeVisible();
    await expect(virtualMachine.tabVolumes).toHaveText('Volumes');

    if (os.platform() === 'darwin') {
      await expect(virtualMachine.tabNetwork).toBeVisible();
      await expect(virtualMachine.tabNetwork).toHaveText('Network');
      await expect(virtualMachine.tabEmulation).toBeVisible();
      await expect(virtualMachine.tabEmulation).toHaveText('Emulation');
    } else {
      await expect(virtualMachine.tabNetwork).not.toBeVisible();
      await expect(virtualMachine.tabEmulation).not.toBeVisible();
    }

    await expect(virtualMachine.memory).toBeVisible();
    await expect(virtualMachine.cpus).toBeVisible();
  });

  test('should render volumes tab', async() => {
    test.skip(os.platform() === 'win32', 'Virtual Machine not available on Windows');
    const { virtualMachine } = new PreferencesPage(preferencesWindow);

    await virtualMachine.tabVolumes.click();

    await expect(virtualMachine.mountType).toBeVisible();
    await expect(virtualMachine.reverseSshFs).toBeVisible();
    await expect(virtualMachine.ninep).toBeVisible();

    if (os.platform() === 'darwin') {
      await expect(virtualMachine.virtiofs).toBeVisible();

      if (parseInt(os.release()) < 22) {
        await expect(virtualMachine.virtiofs).toBeDisabled();
      } else {
        await expect(virtualMachine.virtiofs).not.toBeDisabled();
      }
    } else {
      await expect(virtualMachine.virtiofs).not.toBeVisible();
    }

    await expect(virtualMachine.reverseSshFs).toBeChecked();

    await virtualMachine.ninep.click();
    await expect(virtualMachine.cacheMode).toBeVisible();
    await expect(virtualMachine.msizeInKib).toBeVisible();
    await expect(virtualMachine.protocolVersion).toBeVisible();
    await expect(virtualMachine.securityModel).toBeVisible();
  });

  test('should render network tab on macOS', async() => {
    test.skip(os.platform() !== 'darwin', 'Network tab only available on macOS');

    const { virtualMachine } = new PreferencesPage(preferencesWindow);

    await virtualMachine.tabNetwork.click();
    await expect(virtualMachine.socketVmNet).toBeVisible();
  });

  test('should render emulation tab on macOS', async() => {
    test.skip(os.platform() !== 'darwin', 'Emulation tab only available on macOS');

    const { virtualMachine } = new PreferencesPage(preferencesWindow);

    await virtualMachine.tabEmulation.click();
    await expect(virtualMachine.vmType).toBeVisible();
    await expect(virtualMachine.qemu).toBeVisible();
    await expect(virtualMachine.vz).toBeVisible();

    if (parseInt(os.release()) < 22) {
      await expect(virtualMachine.vz).toBeDisabled();
    } else {
      await expect(virtualMachine.vz).not.toBeDisabled();
      await virtualMachine.vz.click();
      await expect(virtualMachine.useRosetta).toBeVisible();

      if (os.arch() === 'arm64') {
        await expect(virtualMachine.useRosetta).not.toBeDisabled();
      } else {
        await expect(virtualMachine.useRosetta).toBeDisabled();
      }
    }
  });

  test('should navigate to container engine', async() => {
    const { containerEngine } = new PreferencesPage(preferencesWindow);

    await containerEngine.nav.click();

    await expect(containerEngine.nav).toHaveClass('preferences-nav-item active');
    await expect(containerEngine.containerEngine).toBeVisible();

    await expect(containerEngine.tabGeneral).toBeVisible();
    await expect(containerEngine.tabAllowedImages).toBeVisible();
  });

  test('should render container engine page after close and reopen preferences modal', async() => {
    await preferencesWindow.close();

    await new NavPage(page).preferencesButton.click();
    preferencesWindow = await electronApp.waitForEvent('window', page => /preferences/i.test(page.url()));

    expect(preferencesWindow).toBeDefined();
    // Wait for the window to actually load (i.e. transition from
    // app://index.html/#/preferences to app://index.html/#/Preferences#general)
    await preferencesWindow.waitForURL(/Preferences/);
    const { containerEngine } = new PreferencesPage(preferencesWindow);

    await expect(containerEngine.nav).toHaveClass('preferences-nav-item active');
    await expect(containerEngine.containerEngine).toBeVisible();

    await expect(containerEngine.tabGeneral).toBeVisible();
    await expect(containerEngine.tabAllowedImages).toBeVisible();
  });

  test('should render allowed images tab after click on allowed images tab', async() => {
    const { containerEngine } = new PreferencesPage(preferencesWindow);

    await containerEngine.tabAllowedImages.click();

    await expect(containerEngine.allowedImages).toBeVisible();
    await expect(containerEngine.containerEngine).not.toBeVisible();
  });

  test('should render allowed image tab in container engine page after close and reopen preferences modal', async() => {
    await preferencesWindow.close();

    await new NavPage(page).preferencesButton.click();
    preferencesWindow = await electronApp.waitForEvent('window', page => /preferences/i.test(page.url()));

    expect(preferencesWindow).toBeDefined();
    // Wait for the window to actually load (i.e. transition from
    // app://index.html/#/preferences to app://index.html/#/Preferences#general)
    await preferencesWindow.waitForURL(/Preferences/);
    const { containerEngine } = new PreferencesPage(preferencesWindow);

    await expect(containerEngine.nav).toHaveClass('preferences-nav-item active');
    await expect(containerEngine.allowedImages).toBeVisible();
    await expect(containerEngine.containerEngine).not.toBeVisible();
  });

  test('should navigate to kubernetes', async() => {
    const { kubernetes, containerEngine } = new PreferencesPage(preferencesWindow);

    await kubernetes.nav.click();

    await expect(containerEngine.nav).toHaveClass('preferences-nav-item');
    await expect(kubernetes.nav).toHaveClass('preferences-nav-item active');
    await expect(kubernetes.kubernetesToggle).toBeVisible();
    await expect(kubernetes.kubernetesVersion).toBeVisible();
    await expect(kubernetes.kubernetesPort).toBeVisible();
    await expect(kubernetes.traefikToggle).toBeVisible();
  });

  test('should navigate to WSL and render network tab', async() => {
    test.skip(os.platform() !== 'win32', 'WSL nav item not available on macOS & Linux');
    const { wsl } = new PreferencesPage(preferencesWindow);

    await wsl.nav.click();

    await expect(wsl.nav).toHaveClass('preferences-nav-item active');

    await expect(wsl.tabNetwork).toHaveText('Network');
    await expect(wsl.tabIntegrations).toBeVisible();
    await expect(wsl.tabIntegrations).toHaveText('Integrations');

    await expect(wsl.networkingTunnel).toBeVisible();
  });

  test('should integrations tab', async() => {
    test.skip(os.platform() !== 'win32', 'WSL nav item not available on macOS & Linux');
    const { wsl } = new PreferencesPage(preferencesWindow);

    await wsl.tabIntegrations.click();
    await expect(wsl.wslIntegrations).toBeVisible();
  });

  test('should not render WSL nav item on macOS and Linux', async() => {
    test.skip(os.platform() === 'win32', 'WSL nav item is only available on Windows');
    const { wsl } = new PreferencesPage(preferencesWindow);

    await expect(wsl.nav).not.toBeVisible();
  });
});

/**
 * This script builds the javascript, without packaging it up for use.  This is
 * mostly useful for more comprehensive checking.
 */

'use strict';

import * as fs from 'fs/promises';
import * as os from 'os';
import * as path from 'path';

import { simpleSpawn } from 'scripts/simple_process';

import buildUtils from './lib/build-utils';

class Builder {
  async cleanup() {
    console.log('Removing previous builds...');
    const dirs = [
      path.resolve(buildUtils.rendererSrcDir, 'dist'),
      path.resolve(buildUtils.distDir),
    ];
    const options = {
      force: true, maxRetries: 3, recursive: true,
    };

    await Promise.all(dirs.map(dir => fs.rm(dir, options)));

    if (/^win/i.test(os.platform())) {
      // On Windows, virus scanners (e.g. the default Windows Defender) like to
      // hold files open upon deletion(!?) and delay the deletion for a second
      // or two.  Wait for those directories to actually be gone before
      // continuing.
      const waitForDelete = async(dir: string) => {
        while (true) {
          try {
            await fs.stat(dir);
            await buildUtils.sleep(500);
          } catch (error: any) {
            if (error?.code === 'ENOENT') {
              return;
            }
            throw error;
          }
        }
      };

      await Promise.all(dirs.map(waitForDelete));
    }
  }

  async buildRenderer() {
    const nuxtBin = 'node_modules/nuxt/bin/nuxt.js';
    const nuxtOutDir = path.join(buildUtils.rendererSrcDir, 'dist');

    await simpleSpawn('node', [nuxtBin, 'build', buildUtils.rendererSrcDir]);
    await simpleSpawn('node', [nuxtBin, 'generate', buildUtils.rendererSrcDir]);
    await fs.rename(nuxtOutDir, buildUtils.appDir);
  }

  async build() {
    console.log('Building...');
    await this.buildRenderer();
    await buildUtils.buildPreload();
    await buildUtils.buildMain();
  }

  async run() {
    await this.cleanup();
    await this.build();
  }
}

(new Builder()).run().catch((e) => {
  console.error(e);
  process.exit(1);
});

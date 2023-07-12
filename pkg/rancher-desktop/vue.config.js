// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');

const outputDir = 'dist';

console.log('NOT FAIL');
console.log('NOT FAIL');
console.log('NOT FAIL');
console.log('NOT FAIL');
console.log('NOT FAIL');
console.log('DIR NAME', { __dirname });
console.log('NOT FAIL');
console.log('NOT FAIL');
console.log('NOT FAIL');
console.log('NOT FAIL');
console.log('NOT FAIL');

module.exports = {
//       '~assets/styles/base/_variables.scss',
//       '~assets/styles/base/_functions.scss',
//       '~assets/styles/base/_mixins.scss',
  css: {
    loaderOptions: {
      sass: {
        additionalData: `
          @use 'sass:math';
          @import "@pkg/assets/styles/base/_variables.scss";
          @import "@pkg/assets/styles/base/_functions.scss";
          @import "@pkg/assets/styles/base/_mixins.scss";
        `,
      },
    },
  },
  configureWebpack: {
    resolve: {
      alias: {
        '~':    path.resolve(__dirname),
        '@pkg': path.resolve(__dirname),
      },
    },
    module: {
      rules: [
      // Handler for yaml files (used for i18n files, for example)
        {
          test:    /\.ya?ml$/i,
          loader:  'js-yaml-loader',
          options: { name: '[path][name].[ext]' },
        },
        {
          test:   /(?:^|[/\\])assets[/\\]scripts[/\\]/,
          loader: 'raw-loader',
        },
      ],
    },
  },

  outputDir,

  pages: {
    index: {
      entry:    path.join(__dirname, 'nuxt', 'client.js'),
      template: path.join(__dirname, 'public', 'index.html'),
    },
  },
};

// 'use strict';

// import _ from 'lodash';

// import babelConfig from '../../babel.config';
// import * as packageMeta from '../../package.json';

// const isDevelopment = /^dev/i.test(process.env.NODE_ENV);
// const corejsVersion = parseFloat(/\d+\.\d+/.exec(packageMeta.dependencies['core-js']));
// const modifiedBabelConfig = _.cloneDeep(babelConfig);

// modifiedBabelConfig.presets.unshift(['@nuxt/babel-preset-app', { corejs: { version: corejsVersion } }]);

// export default {
//   build: {
//     babel:     modifiedBabelConfig,
//     devtools:  isDevelopment,
//     transpile: ['yaml'],
//     extend(webpackConfig) {
//       // Override the webpack target, so that we get the correct mix of
//       // electron (chrome) + nodejs modules (for ipcRenderer).
//       webpackConfig.target = 'electron-renderer';
//       // Set a resolver alias for `./@pkg` so that we can load things from @ in CSS
//       webpackConfig.resolve.alias['./@pkg'] = __dirname;

//       // Add necessary loaders
//       webpackConfig.module.rules.push({
//         test:    /\.ya?ml(?:\?[a-z0-9=&.]+)?$/,
//         loader:  'js-yaml-loader',
//         options: { name: '[path][name].[ext]' },
//       });
//       webpackConfig.module.rules.push({
//         test:   /(?:^|[/\\])assets[/\\]scripts[/\\]/,
//         loader: 'raw-loader',
//       });
//     },
//   },
//   buildDir:     '../../dist/nuxt',
//   buildModules: [
//     '@nuxtjs/router-extras',
//     '@nuxtjs/style-resources',
//     '@nuxt/typescript-build',
//   ],
//   // Global CSS
//   css: [
//     // This @ alias is a nuxt-provided default
//     // https://nuxtjs.org/docs/configuration-glossary/configuration-alias/
//     '@/assets/styles/app.scss',
//   ],
//   generate:         { devtools: isDevelopment },
//   head:             { meta: [{ charset: 'utf-8' }] },
//   loading:          false,
//   loadingIndicator: false,
//   modules:          [
//     'cookie-universal-nuxt',
//   ],
//   plugins: [
//     // Third-party
//     { src: '~/plugins/shortkey', ssr: false },
//     '~/plugins/tooltip',
//     '~/plugins/v-select',
//     '~/plugins/vue-js-modal',

//     // First-party
//     '~/plugins/i18n',
//     '~/plugins/directives',
//     '~/plugins/clean-html-directive',
//     { src: '~/plugins/extend-router' },
//   ],
//   router: {
//     mode:          'hash',
//     prefetchLinks: false,
//     middleware:    ['i18n', 'indexRedirect'],
//     extendRoutes(routes, resolve) {
//       routes.push({
//         name:      'rdx-root-src-id',
//         path:      '/extensions/:root(.*)/:src/:id',
//         component: resolve(__dirname, 'pages/extensions/_root/_src/_id.vue'),
//       });
//     },
//   },
//   ssr:            false,
//   styleResources: {
//     // only import functions, mixins, or variables, NEVER import full styles https://github.com/nuxt-community/style-resources-module#warning
//     hoistUseStatements: true,
//     scss:               [
//       '~assets/styles/base/_variables.scss',
//       '~assets/styles/base/_functions.scss',
//       '~assets/styles/base/_mixins.scss',
//     ],
//   },
//   target:              'static',
//   telemetry:           false,
//   publicRuntimeConfig: {
//     featureDiagnosticsFixes: process.env.RD_ENV_DIAGNOSTICS_FIXES === '1',
//     featureExtensions:       true,
//   },
// };

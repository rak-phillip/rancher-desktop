import { importTypes } from '@rancher/auto-import';
import { IPlugin } from '@shell/core/types';

import routes from './router';
// import applicationSettings from './store/applicationSettings';
import { credentialsStore } from './store/credentials';
import { diagnosticsStore } from './store/diagnostics';
import { helpStore } from './store/help';
import { imageManagerStore } from './store/imageManager';
import { k8sManagerStore } from './store/k8sManager';
import { pageStore } from './store/page';
import { preferencesStore } from './store/preferences';
import { transientStore } from './store/transientSettings';

// Init the package
export default function(plugin: IPlugin) {
  // Auto-import model, detail, edit from the folders
  importTypes(plugin);

  // Provide plugin metadata from package.json
  plugin.metadata = require('./package.json');

  // Load a product
  plugin.addProduct(require('./product'));

  // Add Vuex stores
  plugin.addDashboardStore(pageStore.config.namespace, pageStore.specifics, pageStore.config);
  plugin.addDashboardStore(preferencesStore.config.namespace, preferencesStore.specifics, preferencesStore.config);
  plugin.addDashboardStore(transientStore.config.namespace, transientStore.specifics, transientStore.config);
  plugin.addDashboardStore(k8sManagerStore.config.namespace, k8sManagerStore.specifics, k8sManagerStore.config);
  plugin.addDashboardStore(imageManagerStore.config.namespace, imageManagerStore.specifics, imageManagerStore.config);
  plugin.addDashboardStore(diagnosticsStore.config.namespace, diagnosticsStore.specifics, diagnosticsStore.config);
  plugin.addDashboardStore(credentialsStore.config.namespace, credentialsStore.specifics, credentialsStore.config);
  plugin.addDashboardStore(helpStore.config.namespace, helpStore.specifics, helpStore.config);
  // plugin.addDashboardStore(applicationSettings.config.namespace, applicationSettings.specifics, applicationSettings.config);

  plugin.addRoutes(routes);
}

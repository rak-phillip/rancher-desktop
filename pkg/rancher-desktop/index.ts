import { importTypes } from '@rancher/auto-import';
import { IPlugin } from '@shell/core/types';

import routes from './router';
import applicationSettings from './store/applicationSettings';
import credentials from './store/credentials';
import diagnostics from './store/diagnostics';
import imageManager from './store/imageManager';
import k8sManager from './store/k8sManager';
import page from './store/page';
import preferences from './store/preferences';
import transientSettings from './store/transientSettings';

// Init the package
export default function(plugin: IPlugin) {
  // Auto-import model, detail, edit from the folders
  importTypes(plugin);

  // Provide plugin metadata from package.json
  plugin.metadata = require('./package.json');

  // Load a product
  plugin.addProduct(require('./product'));

  // Add Vuex stores
  plugin.addDashboardStore(page.config.namespace, page.specifics, page.config);
  plugin.addDashboardStore(preferences.config.namespace, preferences.specifics, preferences.config);
  plugin.addDashboardStore(transientSettings.config.namespace, transientSettings.specifics, transientSettings.config);
  plugin.addDashboardStore(k8sManager.config.namespace, k8sManager.specifics, k8sManager.config);
  plugin.addDashboardStore(imageManager.config.namespace, imageManager.specifics, imageManager.config);
  plugin.addDashboardStore(diagnostics.config.namespace, diagnostics.specifics, diagnostics.config);
  plugin.addDashboardStore(credentials.config.namespace, credentials.specifics, credentials.config);
  plugin.addDashboardStore(applicationSettings.config.namespace, applicationSettings.specifics, applicationSettings.config);

  plugin.addRoutes(routes);
}

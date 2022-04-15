// This import is for the tray found in the menu bar (upper right on macos or
// lower right on Windows).

import fs from 'fs';
import path from 'path';
import os from 'os';

import Electron from 'electron';
import yaml from 'yaml';

import { KubeConfig } from '@kubernetes/client-node';
import * as kubectl from '@/k8s-engine/kubectl';
import kubeconfig from '@/config/kubeconfig.js';
import { State } from '@/k8s-engine/k8s';
import { openPreferences } from '@/window';
import { openDashboard } from '@/window/dashboard';
import mainEvents from '@/main/mainEvents';
import { Settings, load } from '@/config/settings';
import paths from '@/utils/paths';

/**
 * Tray is a class to manage the tray icon for rancher-desktop.
 */
export class Tray {
  protected trayMenu: Electron.Tray;
  protected contextMenuItems: Electron.MenuItemConstructorOptions[] = [
    {
      id:      'state',
      enabled: false,
      label:   'Kubernetes is starting',
      type:    'normal',
      icon:    path.join(paths.resources, 'icons', 'kubernetes-icon-black.png'),
    },
    { type: 'separator' },
    {
      id:      'dashboard',
      enabled: false,
      label:   'Dashboard',
      type:    'normal',
      click:   openDashboard,
    },
    { type: 'separator' },
    {
      id:    'preferences',
      label: 'Preferences',
      type:  'normal',
      click: openPreferences,
    },
    {
      id:      'contexts',
      label:   'Kubernetes Contexts',
      type:    'submenu',
      submenu: [],
    },
    { type: 'separator' },
    {
      label: 'Quit Rancher Desktop',
      role:  'quit',
      type:  'normal',
    },
  ];

  protected kubernetesState = State.STOPPED;
  private settings: Settings;

  private isMacOs = () => {
    return os.platform() === 'darwin';
  };

  private readonly trayIconsMacOs = {
    stopped:  path.join(paths.resources, 'icons', 'logo-tray-stopped-Template@2x.png'),
    starting: path.join(paths.resources, 'icons', 'logo-tray-starting-Template@2x.png'),
    started:  path.join(paths.resources, 'icons', 'logo-tray-Template@2x.png'),
    stopping: path.join(paths.resources, 'icons', 'logo-tray-stopping-Template@2x.png'),
    error:    path.join(paths.resources, 'icons', 'logo-tray-error-Template@2x.png'),
  };

  private readonly trayIcons = {
    stopped:  '',
    starting: path.join(paths.resources, 'icons', 'logo-square-bw.png'),
    started:  path.join(paths.resources, 'icons', 'logo-square.png'),
    stopping: '',
    error:    path.join(paths.resources, 'icons', 'logo-square-red.png'),
  };

  private readonly trayIconSet = this.isMacOs() ? this.trayIconsMacOs : this.trayIcons;

  /**
   * Create a watcher for the provided kubeconfigPath; when the change event is
   * triggered, close the watcher and restart after a duration (1 second)
   * @param kubeconfigPath The path to watch for Kubernetes config changes
   */
  private watchOnceAndRestart = (kubeconfigPath: string) => {
    const watcher = fs.watch(kubeconfigPath);

    watcher.on('error', (err) => {
      console.error(`Failed to fs.watch ${ kubeconfigPath }:`, err);
    });

    watcher.on('change', (eventType, _) => {
      if (eventType === 'rename' && !kubeconfig.hasAccess(kubeconfigPath)) {
        // File doesn't exist. Wait for it to be recreated
        return;
      }

      watcher.close();

      this.buildFromConfig(kubeconfigPath);

      setTimeout(this.watchOnceAndRestart, 1000, kubeconfigPath);
    });
  };

  constructor() {
    this.settings = load();
    this.trayMenu = new Electron.Tray(this.trayIconSet.starting);
    this.trayMenu.setToolTip('Rancher Desktop');

    // Discover k8s contexts
    try {
      this.updateContexts();
    } catch (err) {
      if (err instanceof TypeError &&
          err.message.includes("Cannot read property 'clusters' of undefined") &&
          err.stack?.includes('loadFromFile')) {
        Electron.dialog.showErrorBox('Error reading config file:',
          'Please check your config file(s) for problems.');
      } else {
        Electron.dialog.showErrorBox('Error starting the app:',
          `Error message: ${ err instanceof Error ? err.message : err }`);
      }
    }

    const contextMenu = Electron.Menu.buildFromTemplate(this.contextMenuItems);

    this.trayMenu.setContextMenu(contextMenu);

    const kubeconfigPath = kubeconfig.path();

    if (!kubeconfigPath) {
      throw new Error('No kubeconfig path found');
    }
    this.buildFromConfig(kubeconfigPath);

    this.watchOnceAndRestart(kubeconfigPath);

    mainEvents.on('k8s-check-state', (mgr) => {
      this.k8sStateChanged(mgr.state);
    });
    mainEvents.on('settings-update', (cfg) => {
      this.settings = cfg;
      this.settingsChanged();
    });
  }

  protected buildFromConfig(configPath: string) {
    if (!kubeconfig.hasAccess(configPath)) {
      return;
    }

    try {
      let parsedConfig;
      const contents = fs.readFileSync(configPath).toString();

      if (contents.length === 0) {
        console.log('Config file is empty, will try to process it later');

        return;
      }

      try {
        parsedConfig = yaml.parse(contents);
      } catch (err) {
        console.log(`yaml parse failure: ${ err } on kubeconfig: contents ${ contents }., will retry later.`);
        parsedConfig = null;
      }

      if ((parsedConfig?.clusters || []).length === 0) {
        console.log('Config file has no clusters, will retry later');

        return;
      }
      this.updateContexts();
      const contextMenu = Electron.Menu.buildFromTemplate(this.contextMenuItems);

      this.trayMenu.setContextMenu(contextMenu);
    } catch (err) {
      console.log(`Error trying to update context menu: ${ err }`);
    }
  }

  /**
   * Called when the Kubernetes cluster state has changed.
   * @param state The new cluster state.
   */
  protected k8sStateChanged(state: State) {
    this.kubernetesState = state;
    this.updateMenu();
  }

  /**
   * Called when the application settings have changed.
   */
  protected settingsChanged() {
    this.updateMenu();
  }

  protected updateMenu() {
    const labels = {
      [State.STOPPED]:  'Kubernetes is stopped',
      [State.STARTING]: 'Kubernetes is starting',
      [State.STARTED]:  'Kubernetes is running',
      [State.STOPPING]: 'Kubernetes is shutting down',
      [State.ERROR]:    'Kubernetes has encountered an error',
      [State.DISABLED]: 'Kubernetes is disabled',
    };

    let icon = path.join(paths.resources, 'icons', 'kubernetes-icon-black.png');
    let logo = this.trayIconSet.starting;

    if (this.kubernetesState === State.STARTED) {
      icon = path.join(paths.resources, 'icons', 'kubernetes-icon-color.png');
      logo = this.trayIconSet.started;
      // Update the contexts as a new kubernetes context will be added
      this.updateContexts();
      this.contextMenuItems = this.updateDashboardState(
        this.kubernetesState === State.STARTED &&
        this.settings.kubernetes.enabled
      );
    } else if (this.kubernetesState === State.ERROR) {
      // For licensing reasons, we cannot just tint the Kubernetes logo.
      // Here we're using an icon from GitHub's octicons set.
      icon = path.join(paths.resources, 'icons', 'issue-opened-16.png');
      logo = this.trayIconSet.error;
    }

    const stateMenu = this.contextMenuItems.find(item => item.id === 'state');

    if (stateMenu) {
      stateMenu.label = labels[this.kubernetesState] || labels[State.ERROR];
      stateMenu.icon = icon;
    }

    const contextMenu = Electron.Menu.buildFromTemplate(this.contextMenuItems);

    this.trayMenu.setContextMenu(contextMenu);
    this.trayMenu.setImage(logo);
  }

  protected verifyKubeConfig() {
    if (process.env.KUBECONFIG && process.env.KUBECONFIG.length > 0) {
      const originalFiles = process.env.KUBECONFIG.split(path.delimiter);
      const filteredFiles = originalFiles.filter(kubeconfig.hasAccess);

      if (filteredFiles.length < originalFiles.length) {
        process.env.KUBECONFIG = filteredFiles.join(path.delimiter);
      }
    }
  }

  protected updateDashboardState = (enabled = true) => this.contextMenuItems
    .map(item => item.id === 'dashboard' ? { ...item, enabled } : item);

  /**
   * Update the list of Kubernetes contexts in the tray menu.
   */
  protected updateContexts() {
    const kc = new KubeConfig();

    this.verifyKubeConfig();
    kc.loadFromDefault();

    const contextsMenu = this.contextMenuItems.find(item => item.id === 'contexts');
    const curr = kc.getCurrentContext();
    const cxts = kc.getContexts();

    if (!contextsMenu) {
      return;
    }
    if (cxts.length === 0) {
      contextsMenu.submenu = [{ label: 'None found' }];
    } else {
      contextsMenu.submenu = cxts.map(val => ({
        label:   val.name,
        type:    'checkbox',
        click:   menuItem => this.contextClick(menuItem),
        checked: (val.name === curr),
      }));
    }
  }

  /**
   * Call back when a menu item is clicked to change the active Kubernetes context.
   * @param {Electron.MenuItem} menuItem The menu item that was clicked.
   */
  protected contextClick(menuItem: Electron.MenuItem) {
    kubectl.setCurrentContext(menuItem.label, () => {
      this.updateContexts();
      const contextMenu = Electron.Menu.buildFromTemplate(this.contextMenuItems);

      this.trayMenu.setContextMenu(contextMenu);
    });
  }
}

export default function setupTray() {
  new Tray();
}

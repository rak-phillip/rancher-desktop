import Electron, { BrowserWindow, app, shell } from 'electron';
import _ from 'lodash';

import Logging from '@/utils/logging';
import { IpcRendererEvents } from '@/typings/electron-ipc';
import * as K8s from '@/k8s-engine/k8s';

const console = Logging.background;

/**
 * A mapping of window key (which is our own construct) to a window ID (which is
 * assigned by electron).
 */
export const windowMapping: Record<string, number> = {};

function getWebRoot() {
  if (/^(?:dev|test)/i.test(process.env.NODE_ENV || '')) {
    return 'http://localhost:8888';
  }

  return 'app://.';
}

/**
 * Restore or focus a window if it is already open
 * @param window The Electron Browser window to show or restore
 * @returns Boolean: True if the browser window is shown or restored
 */
export const restoreWindow = (window: Electron.BrowserWindow | null): window is Electron.BrowserWindow => {
  if (window) {
    if (!window.isFocused()) {
      if (window.isMinimized()) {
        window.restore();
      }
      window.show();
    }

    return true;
  }

  return false;
};

/**
 * Return an existing window of the given ID.
 */
function getWindow(name: string): Electron.BrowserWindow | null {
  return (name in windowMapping) ? BrowserWindow.fromId(windowMapping[name]) : null;
}

/**
 * Open a given window; if it is already open, focus it.
 * @param name The window identifier; this controls window re-use.
 * @param url The URL to load into the window.
 * @param options A hash of options used by `new BrowserWindow(options)`
 * @param prefs Options to control the new window.
 */
function createWindow(name: string, url: string, options: Electron.BrowserWindowConstructorOptions) {
  let window = getWindow(name);

  if (restoreWindow(window)) {
    return window;
  }

  const isInternalURL = (url: string) => {
    return url.startsWith(`${ getWebRoot() }/`);
  };

  window = new BrowserWindow(options);
  window.webContents.on('will-navigate', (event, input) => {
    if (isInternalURL(input)) {
      return;
    }
    shell.openExternal(input);
    event.preventDefault();
  });
  window.webContents.setWindowOpenHandler((details) => {
    if (isInternalURL(details.url)) {
      window?.webContents.loadURL(details.url);
    } else {
      shell.openExternal(details.url);
    }

    return { action: 'deny' };
  });
  window.webContents.on('did-fail-load', (event, errorCode, errorDescription, url) => {
    console.log(`Failed to load ${ url }: ${ errorCode } (${ errorDescription })`);
  });
  window.loadURL(url);
  windowMapping[name] = window.id;

  return window;
}

/**
 * Open the preferences window; if it is already open, focus it.
 */
export function openPreferences() {
  const webRoot = getWebRoot();

  createWindow('preferences', `${ webRoot }/index.html`, {
    width:          940,
    height:         600,
    webPreferences: {
      devTools:           !app.isPackaged,
      nodeIntegration:    true,
      contextIsolation:   false,
    },
  });
  app.dock?.show();
}

/**
 * Internal helper function to open a given modal dialog.
 *
 * @param id The URL for the dialog, corresponds to a Nuxt page; e.g. FirstRun.
 * @returns The opened window
 */
function openDialog(id: string, opts?: Electron.BrowserWindowConstructorOptions) {
  const webRoot = getWebRoot();
  const window = createWindow(
    id,
    // We use hash mode for the router, so `index.html#FirstRun` loads
    // src/pages/FirstRun.vue.
    `${ webRoot }/index.html#${ id }`,
    {
      autoHideMenuBar: !app.isPackaged,
      show:            false,
      useContentSize:  true,
      modal:           true,
      resizable:       false,
      ...opts ?? {},
      webPreferences:  {
        devTools:                !app.isPackaged,
        nodeIntegration:         true, // required for ipcRenderer
        contextIsolation:        false,
        enablePreferredSizeMode: true,
        ...opts?.webPreferences ?? {},
      }
    }
  );

  let windowState: 'hidden' | 'shown' | 'sized' = 'hidden';

  window.menuBarVisible = false;

  window.webContents.on('ipc-message', (event, channel) => {
    if (channel === 'dialog/ready') {
      window.show();
      windowState = 'shown';
    }
  });

  window.webContents.on('preferred-size-changed', (_event, { width, height }) => {
    window.setContentSize(width, height);

    const [windowWidth, windowHeight] = window.getSize();

    window.setMinimumSize(windowWidth, windowHeight);
  });

  return window;
}

/**
 * Open the first run window, and return once the user has accepted any
 * configuration required.
 */
export async function openFirstRun() {
  const window = openDialog('FirstRun');

  await (new Promise<void>((resolve) => {
    window.on('closed', resolve);
  }));
}

/**
 * Open the error message window as a modal window.
 */
export async function openKubernetesErrorMessageWindow(titlePart: string, mainMessage: string, failureDetails: K8s.FailureDetails) {
  const window = openDialog('KubernetesError', {
    width:  800,
    height: 494,
    parent: getWindow('preferences') ?? undefined,
  });

  window.webContents.on('ipc-message', (event, channel) => {
    if (channel === 'dialog/load') {
      window.webContents.send('dialog/populate', titlePart, mainMessage, failureDetails);
    }
  });
  await (new Promise<void>((resolve) => {
    window.on('closed', resolve);
  }));
}

/**
 * Show the prompt describing why we would like sudo permissions.
 *
 * @param explanations A list of reasons why we want sudo permissions.
 * @returns A promise that is resolved when the window closes. It is true if
 *   the user does not want to allow sudo, and never wants to see the propmt
 *   again.
 */
export async function openSudoPrompt(explanations: string[]): Promise<boolean> {
  const window = openDialog('SudoPrompt', { parent: getWindow('preferences') ?? undefined });

  /**
   * The result of the dialog; this is true if the user asked to never be
   * prompted again (and therefore we should not attempt to run sudo).
   */
  let result = false;

  window.webContents.on('ipc-message', (event, channel, ...args) => {
    if (channel === 'dialog/load') {
      window.webContents.send('dialog/populate', explanations);
    } else if (channel === 'sudo-prompt/closed') {
      result = args[0] ?? false;
    }
  });
  await (new Promise<void>((resolve) => {
    window.on('closed', resolve);
  }));

  return result;
}

export async function openPathUpdate() {
  const window = openDialog(
    'PathUpdate',
    {
      title:  'Rancher Desktop - Update',
      frame:  true,
      parent: getWindow('preferences') ?? undefined,
    });

  await (new Promise<void>((resolve) => {
    window.on('closed', resolve);
  }));
}

/**
 * Send a message to all windows in the renderer process.
 * @param channel The channel to send on.
 * @param  args Any arguments to pass.
 */
export function send<eventName extends keyof IpcRendererEvents>(
  channel: eventName,
  ...args: Parameters<IpcRendererEvents[eventName]>
): void;
/** @deprecated The channel to send on must be declared. */
export function send(channel: string, ...args: any[]) {
  for (const windowId of Object.values(windowMapping)) {
    const window = BrowserWindow.fromId(windowId);

    if (window && !window.isDestroyed()) {
      window.webContents.send(channel, ...args);
    }
  }
}

import Electron, { Menu, MenuItem, MenuItemConstructorOptions, shell } from 'electron';

export default function buildApplicationMenu(): void {
  const menuItems: Array<MenuItem> = [];
  const isMac = process.platform === 'darwin';
  const isWindows = process.platform === 'win32';

  if (isMac) {
    menuItems.push(new MenuItem({
      label: Electron.app.name,
      role:  'appMenu',
    }));
  }

  menuItems.push(new MenuItem({
    label: '&File',
    role:  'fileMenu',
  }));

  if (isMac) {
    menuItems.push(new MenuItem({
      label:   'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        { role: 'delete' },
        { role: 'selectAll' },
      ],
    }));
  } else {
    menuItems.push(new MenuItem({
      label:   '&Edit',
      role:  'editMenu',
    }));
  }

  if (Electron.app.isPackaged) {
    menuItems.push(new MenuItem({
      label:   '&View',
      submenu: [
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' },
      ]
    }));
  } else {
    menuItems.push(new MenuItem({
      label: '&View',
      role:  'viewMenu',
    }));
  }

  if (isMac) {
    menuItems.push(new MenuItem({
      label: '&Window',
      role:  'windowMenu',
    }));
  }

  const helpMenuItems: Array<MenuItemConstructorOptions> = [];

  if (isWindows) {
    helpMenuItems.push({ role: 'about' }, { type: 'separator' });
  }
  helpMenuItems.push(
    {
      label: 'Get &Help',
      click() {
        shell.openExternal('https://github.com/rancher-sandbox/rancher-desktop/tree/main/docs');
      },
    },
    {
      label: 'File a &Bug',
      click() {
        shell.openExternal('https://github.com/rancher-sandbox/rancher-desktop/issues');
      },
    },
    {
      label: '&Product Page',
      click() {
        shell.openExternal('https://rancherdesktop.io/');
      },
    },
    {
      label: '&Discuss',
      click() {
        shell.openExternal('https://slack.rancher.io/');
      },
    },
  )
  menuItems.push(new MenuItem({
    label:   '&Help',
    role:    'help',
    submenu: helpMenuItems,
  }));
  const menu = Menu.buildFromTemplate(menuItems);

  Menu.setApplicationMenu(menu);
}

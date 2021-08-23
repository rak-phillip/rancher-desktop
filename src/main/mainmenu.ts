import Electron, { Menu, MenuItem, shell } from 'electron';

export default function buildApplicationMenu(): void {
  const menuItems: Array<MenuItem> = [];
  const isMac = process.platform === 'darwin';

  if (isMac) {
    menuItems.push(new MenuItem({
      label:   Electron.app.name,
      submenu: [
        {
          role:  'about',
          label: `About ${ Electron.app.name }`,
        },
        { type: 'separator' },
        { role: 'services' },
        { type: 'separator' },
        { role: 'hide' },
        { role: 'hideOthers' },
        { role: 'unhide' },
        { type: 'separator' },
        { role: 'quit' },
      ],
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

  menuItems.push(new MenuItem({
    label:   '&Window',
    role:  'windowMenu',
  }));
  menuItems.push(new MenuItem({
    label:   '&Help',
    submenu: [
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
    ],
  }));
  const menu = Menu.buildFromTemplate(menuItems);

  Menu.setApplicationMenu(menu);
}

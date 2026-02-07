const { app, BrowserWindow, ipcMain, Menu } = require('electron');
const path = require('path');

let win;

function createWindow() {
    win = new BrowserWindow({
        width: 1300,
        height: 900,
        frame: false,
        backgroundColor: '#121417',
        icon: path.join(__dirname, 'icon.ico'), // Görev çubuğu ikonu
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            webviewTag: true
        }
    });

    win.loadFile('index.html');

    // Pencere Kontrolleri
    ipcMain.on('window-controls', (event, action) => {
        switch (action) {
            case 'minimize': win.minimize(); break;
            case 'maximize':
                if (win.isMaximized()) {
                    win.unmaximize();
                } else {
                    win.maximize();
                }
                break;
            case 'close': win.close(); break;
        }
    });

    // Sağ Tık Menüsü (Uygulama Silme)
    ipcMain.on('show-context-menu', (event, id) => {
        const template = [
            {
                label: `${id.toUpperCase()} Uygulamasını Kaldır`,
                click: () => { event.reply('remove-app-confirm', id); }
            }
        ];
        const menu = Menu.buildFromTemplate(template);
        menu.popup(BrowserWindow.fromWebContents(event.sender));
    });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});
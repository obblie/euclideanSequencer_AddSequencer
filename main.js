const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');

function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js')
        }
    });

    mainWindow.loadFile('index.html');

    if (process.env.NODE_ENV === 'development') {
        mainWindow.webContents.openDevTools();
    }
}

// Handle save dialog requests
ipcMain.handle('show-save-dialog', async (event, options) => {
    try {
        console.log('Showing save dialog with options:', options);
        
        const result = await dialog.showSaveDialog({
            title: 'Save Logs as CSV',
            defaultPath: options.defaultPath || `sequencer-logs-${new Date().toISOString().replace(/[:.]/g, '-')}.csv`,
            filters: [
                { name: 'CSV Files', extensions: ['csv'] },
                { name: 'All Files', extensions: ['*'] }
            ],
            properties: ['createDirectory', 'showOverwriteConfirmation']
        });
        
        console.log('Save dialog result:', result);
        return result;
    } catch (error) {
        console.error('Error showing save dialog:', error);
        return { canceled: true, error: error.message };
    }
});

// Handle file writing
ipcMain.handle('write-file', async (event, filePath, content) => {
    try {
        console.log('Writing file to:', filePath);
        fs.writeFileSync(filePath, content);
        return { success: true };
    } catch (error) {
        console.error('Error writing file:', error);
        return { success: false, error: error.message };
    }
});

app.whenReady().then(() => {
    createWindow();

    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        app.quit();
    }
}); 
const { contextBridge, ipcRenderer } = require('electron');
const fs = require('fs');
const path = require('path');
const os = require('os');

contextBridge.exposeInMainWorld('electronAPI', {
    getRandomLogo: () => {
        try {
            const logoDir = path.join(__dirname, '../logos');
            console.log('Looking for logos in:', logoDir);
            
            if (!fs.existsSync(logoDir)) {
                console.error('Logos directory not found at:', logoDir);
                return 'logo.ico';
            }

            const files = fs.readdirSync(logoDir);
            const logoFiles = files.filter(file => 
                /\.(png|jpg|jpeg|ico|svg|gif)$/i.test(file)
            );
            
            console.log('Found logo files:', logoFiles);
            
            if (logoFiles.length > 0) {
                const randomLogo = logoFiles[Math.floor(Math.random() * logoFiles.length)];
                return `../logos/${randomLogo}`;
            }
            return 'logo.ico';
        } catch (error) {
            console.error('Error loading logos:', error);
            return 'logo.ico';
        }
    },
    
    saveLogsToCSV: (logs) => {
        try {
            // Create logs directory in user's documents folder
            const documentsPath = path.join(os.homedir(), 'Documents');
            const logsDir = path.join(documentsPath, 'SequencerLogs');
            
            if (!fs.existsSync(logsDir)) {
                fs.mkdirSync(logsDir, { recursive: true });
            }
            
            // Generate filename with timestamp
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const filename = `sequencer-logs-${timestamp}.csv`;
            const filepath = path.join(logsDir, filename);
            
            // Create CSV header
            const csvHeader = 'Timestamp,Section,Message,Data\n';
            
            // Convert logs to CSV format
            const csvContent = logs.map(log => {
                const timestamp = log.timestamp || new Date().toISOString();
                const section = log.section || '';
                const message = log.message || '';
                const data = log.data ? JSON.stringify(log.data).replace(/"/g, '""') : '';
                
                return `"${timestamp}","${section}","${message}","${data}"`;
            }).join('\n');
            
            // Write to file
            fs.writeFileSync(filepath, csvHeader + csvContent);
            
            return {
                success: true,
                filepath: filepath,
                message: `Logs saved to: ${filepath}`
            };
        } catch (error) {
            console.error('Error saving logs to CSV:', error);
            return {
                success: false,
                error: error.message
            };
        }
    },
    
    saveLogsToCSVWithDialog: async (logs) => {
        try {
            console.log('Starting save dialog process...');
            
            // Create CSV content
            const csvHeader = 'Timestamp,Section,Message,Data\n';
            const csvContent = logs.map(log => {
                const timestamp = log.timestamp || new Date().toISOString();
                const section = log.section || '';
                const message = log.message || '';
                const data = log.data ? JSON.stringify(log.data).replace(/"/g, '""') : '';
                
                return `"${timestamp}","${section}","${message}","${data}"`;
            }).join('\n');
            
            const fullCsv = csvHeader + csvContent;
            
            // Step 1: Show save dialog
            console.log('Requesting save dialog...');
            const dialogResult = await ipcRenderer.invoke('show-save-dialog', {
                defaultPath: `sequencer-logs-${new Date().toISOString().replace(/[:.]/g, '-')}.csv`
            });
            
            console.log('Dialog result:', dialogResult);
            
            if (dialogResult.canceled) {
                return {
                    success: false,
                    error: 'Save cancelled by user'
                };
            }
            
            if (!dialogResult.filePath) {
                return {
                    success: false,
                    error: 'No file path selected'
                };
            }
            
            // Step 2: Write the file
            console.log('Writing file to:', dialogResult.filePath);
            const writeResult = await ipcRenderer.invoke('write-file', dialogResult.filePath, fullCsv);
            
            if (writeResult.success) {
                return {
                    success: true,
                    filepath: dialogResult.filePath,
                    message: `Logs saved to: ${dialogResult.filePath}`
                };
            } else {
                return {
                    success: false,
                    error: writeResult.error || 'Failed to write file'
                };
            }
            
        } catch (error) {
            console.error('Error in saveLogsToCSVWithDialog:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }
}); 
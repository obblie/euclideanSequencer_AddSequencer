const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld(
    'api', {
        requestMIDIAccess: () => {
            // For now, we'll use Web MIDI API directly
            if (navigator.requestMIDIAccess) {
                return navigator.requestMIDIAccess({ sysex: false });
            } else {
                return Promise.reject(new Error('Web MIDI API not supported'));
            }
        },
        // Add more API methods as needed
        saveSetting: (key, value) => ipcRenderer.invoke('save-setting', key, value),
        loadSetting: (key) => ipcRenderer.invoke('load-setting', key),
        savePreset: (preset) => ipcRenderer.invoke('save-preset', preset),
        loadPresets: () => ipcRenderer.invoke('load-presets')
    }
); 
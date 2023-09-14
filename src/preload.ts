const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
console.log('PRELOAD has preloaded');
contextBridge.exposeInMainWorld('api', {
  send: (channel:string, data:any) => {
    // whitelist channels
    const validChannels = ['toMain', 'click', 'app:on-fs-dialog-open', 'get-messages'];
    if (validChannels.includes(channel)) {
      ipcRenderer.send(channel, data);
    }
  },
  receive: (channel: string, func: any) => {
    const validChannels = ['fromMain', 'users', 'users-progress', 'user-messages', 'owner'];
    if (validChannels.includes(channel)) {
      // Deliberately strip event as it includes `sender`
      ipcRenderer.on(channel, (event, ...args) => func(...args));
    }
  },
});

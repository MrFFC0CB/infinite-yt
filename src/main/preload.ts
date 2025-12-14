const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
	getFavorites: (): Promise<Object> => ipcRenderer.invoke('favorites:get'),
	addFavorite: (videoId: string): Promise<Object> => ipcRenderer.invoke('favorites:add', videoId),
	removeFavorite: (videoId: string): Promise<Object> => ipcRenderer.invoke('favorites:remove', videoId),
});
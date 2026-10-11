import { contextBridge, ipcRenderer } from 'electron'
import { SearchResult, CustomCommand } from '../src/types'

contextBridge.exposeInMainWorld('api', {
  hideWindow: () => ipcRenderer.send('window:hide'),
  quit: () => ipcRenderer.send('app:quit'),
  openExternal: (url: string) => ipcRenderer.send('shell:open', url),
  searchApps: (query: string) => ipcRenderer.invoke('apps:search', query),
  launchApp: (appPath: string) => ipcRenderer.invoke('apps:launch', appPath),
  searchCustomCommands: (query: string) => ipcRenderer.invoke('custom:search', query),
  launchCustomCommand: (item: SearchResult) => ipcRenderer.invoke('custom:launch', item),
  getCustomCommands: () => ipcRenderer.invoke('custom:getAll'),
  saveCustomCommand: (cmd: CustomCommand) => ipcRenderer.invoke('custom:save', cmd),
  deleteCustomCommand: (id: string) => ipcRenderer.invoke('custom:delete', id),
  getRecents: () => ipcRenderer.invoke('recents:get'),
  addRecent: (item: SearchResult) => ipcRenderer.invoke('recents:add', item)
})
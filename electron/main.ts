import { app, BrowserWindow, globalShortcut, Tray, Menu, ipcMain, shell, nativeImage } from 'electron'
import path from 'path'
import { searchApps, launchApp } from './appSearch'
import { searchCustomCommands, launchCustomCommand, getCustomCommands, saveCustomCommand, deleteCustomCommand, getRecents, addRecent } from './configStore'
import { SearchResult, CustomCommand } from '../src/types'

let mainWindow: BrowserWindow | null = null
let tray: Tray | null = null

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 600,
    height: 400,
    frame: false,
    transparent: true,
    resizable: false,
    show: false,
    skipTaskbar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  })

  if (process.env.VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL)
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'))
  }

  mainWindow.on('blur', () => {
    mainWindow?.hide()
  })

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

function createTray() {
  try {
    const icon = nativeImage.createFromPath(path.join(__dirname, '../resources/icon.png'))
    if (icon.isEmpty()) {
      const emptyIcon = nativeImage.createEmpty()
      tray = new Tray(emptyIcon)
    } else {
      tray = new Tray(icon)
    }
    const contextMenu = Menu.buildFromTemplate([
      { label: '显示启动器', click: () => showWindow() },
      { label: '退出', click: () => app.quit() }
    ])
    tray.setToolTip('LN Launcher')
    tray.setContextMenu(contextMenu)
    tray.on('click', () => showWindow())
  } catch (e) {
    console.error('Tray creation failed:', e)
  }
}

function showWindow() {
  if (!mainWindow) {
    createWindow()
  }
  mainWindow?.show()
  mainWindow?.focus()
}

function hideWindow() {
  mainWindow?.hide()
}

ipcMain.handle('apps:search', (_e, query: string) => searchApps(query))
ipcMain.handle('apps:launch', (_e, appPath: string) => launchApp(appPath))
ipcMain.handle('custom:search', (_e, query: string) => searchCustomCommands(query))
ipcMain.handle('custom:launch', (_e, item: SearchResult) => launchCustomCommand(item))
ipcMain.handle('custom:getAll', () => getCustomCommands())
ipcMain.handle('custom:save', (_e, cmd: CustomCommand) => saveCustomCommand(cmd))
ipcMain.handle('custom:delete', (_e, id: string) => deleteCustomCommand(id))
ipcMain.handle('recents:get', () => getRecents())
ipcMain.handle('recents:add', (_e, item: SearchResult) => addRecent(item))

app.whenReady().then(() => {
  createWindow()
  createTray()

  globalShortcut.register('Alt+Space', () => {
    if (mainWindow?.isVisible()) {
      hideWindow()
    } else {
      showWindow()
    }
  })

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('will-quit', () => {
  globalShortcut.unregisterAll()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

ipcMain.on('window:hide', () => hideWindow())
ipcMain.on('app:quit', () => app.quit())
ipcMain.on('shell:open', (_e, target: string) => shell.openExternal(target))
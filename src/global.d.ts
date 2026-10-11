import { SearchResult, CustomCommand } from './types'

declare global {
  interface Window {
    api: {
      hideWindow: () => void
      quit: () => void
      openExternal: (url: string) => void
      searchApps: (query: string) => Promise<SearchResult[]>
      launchApp: (appPath: string) => Promise<void>
      searchCustomCommands: (query: string) => Promise<SearchResult[]>
      launchCustomCommand: (item: SearchResult) => Promise<void>
      getCustomCommands: () => Promise<CustomCommand[]>
      saveCustomCommand: (cmd: CustomCommand) => Promise<void>
      deleteCustomCommand: (id: string) => Promise<void>
      getRecents: () => Promise<SearchResult[]>
      addRecent: (item: SearchResult) => Promise<void>
    }
  }
}

export {}
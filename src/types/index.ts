export type CommandType = 'app' | 'url' | 'shell'

export interface SearchResult {
  id: string
  title: string
  subtitle?: string
  icon?: string
  type: CommandType
  action: string
  source: 'system' | 'custom'
}

export interface CustomCommand {
  id: string
  name: string
  keyword: string
  type: CommandType
  action: string
}

export interface RecentItem {
  id: string
  title: string
  type: CommandType
  action: string
  timestamp: number
}

export interface AppConfig {
  customCommands: CustomCommand[]
  recents: RecentItem[]
}
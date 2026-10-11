import fs from 'fs'
import path from 'path'
import { exec } from 'child_process'
import { CustomCommand, SearchResult, RecentItem, AppConfig } from '../src/types'

const configDir = path.join(process.env.APPDATA || process.env.HOME || '', 'ln-launcher')
const configPath = path.join(configDir, 'config.json')

function ensureConfigDir() {
  if (!fs.existsSync(configDir)) {
    fs.mkdirSync(configDir, { recursive: true })
  }
}

function loadConfig(): AppConfig {
  ensureConfigDir()
  if (!fs.existsSync(configPath)) {
    return { customCommands: [], recents: [] }
  }
  try {
    const raw = fs.readFileSync(configPath, 'utf-8')
    return JSON.parse(raw)
  } catch {
    return { customCommands: [], recents: [] }
  }
}

function saveConfig(config: AppConfig) {
  ensureConfigDir()
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2))
}

export function searchCustomCommands(query: string): SearchResult[] {
  const config = loadConfig()
  const lower = query.toLowerCase()
  return config.customCommands
    .filter(cmd => cmd.name.toLowerCase().includes(lower) || cmd.keyword.toLowerCase().includes(lower))
    .map(cmd => ({
      id: `custom-${cmd.id}`,
      title: cmd.name,
      subtitle: cmd.keyword,
      type: cmd.type,
      action: cmd.action,
      source: 'custom' as const
    }))
}

export function launchCustomCommand(item: SearchResult): void {
  if (item.type === 'url') {
    exec(`start "" "${item.action}"`)
  } else if (item.type === 'shell') {
    exec(item.action)
  } else if (item.type === 'app') {
    exec(`start "" "${item.action}"`)
  }
}

export function getCustomCommands(): CustomCommand[] {
  return loadConfig().customCommands
}

export function saveCustomCommand(cmd: CustomCommand): void {
  const config = loadConfig()
  const idx = config.customCommands.findIndex(c => c.id === cmd.id)
  if (idx >= 0) {
    config.customCommands[idx] = cmd
  } else {
    config.customCommands.push(cmd)
  }
  saveConfig(config)
}

export function deleteCustomCommand(id: string): void {
  const config = loadConfig()
  config.customCommands = config.customCommands.filter(c => c.id !== id)
  saveConfig(config)
}

export function getRecents(): SearchResult[] {
  const config = loadConfig()
  return config.recents
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, 10)
    .map(r => ({
      id: r.id,
      title: r.title,
      type: r.type,
      action: r.action,
      source: 'system' as const
    }))
}

export function addRecent(item: SearchResult): void {
  const config = loadConfig()
  const recent: RecentItem = {
    id: item.id,
    title: item.title,
    type: item.type,
    action: item.action,
    timestamp: Date.now()
  }
  config.recents = config.recents.filter(r => r.id !== recent.id)
  config.recents.unshift(recent)
  config.recents = config.recents.slice(0, 20)
  saveConfig(config)
}
import fs from 'fs'
import path from 'path'
import { exec } from 'child_process'
import { SearchResult } from '../src/types'

const isWindows = process.platform === 'win32'

interface AppEntry {
  name: string
  path: string
  icon?: string
}

let cachedApps: AppEntry[] = []

function getWindowsApps(): AppEntry[] {
  const apps: AppEntry[] = []
  const searchDirs = [
    path.join(process.env.PROGRAMDATA || 'C:\\ProgramData', 'Microsoft', 'Windows', 'Start Menu', 'Programs'),
    path.join(process.env.APPDATA || '', 'Microsoft', 'Windows', 'Start Menu', 'Programs'),
    'C:\\Program Files',
    'C:\\Program Files (x86)'
  ]

  for (const dir of searchDirs) {
    if (!fs.existsSync(dir)) continue
    try {
      const entries = findShortcuts(dir)
      apps.push(...entries)
    } catch {
      // ignore
    }
  }

  return apps
}

function findShortcuts(dir: string): AppEntry[] {
  const results: AppEntry[] = []
  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true })
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name)
      if (entry.isDirectory()) {
        results.push(...findShortcuts(fullPath))
      } else if (entry.name.endsWith('.lnk') || entry.name.endsWith('.exe')) {
        const name = entry.name.replace(/\.(lnk|exe)$/i, '')
        results.push({ name, path: fullPath })
      }
    }
  } catch {
    // ignore
  }
  return results
}

function getMacApps(): AppEntry[] {
  const apps: AppEntry[] = []
  const appsDir = '/Applications'
  try {
    const entries = fs.readdirSync(appsDir, { withFileTypes: true })
    for (const entry of entries) {
      if (entry.name.endsWith('.app')) {
        const name = entry.name.replace('.app', '')
        apps.push({ name, path: path.join(appsDir, entry.name) })
      }
    }
  } catch {
    // ignore
  }
  return apps
}

export function loadApps(): AppEntry[] {
  if (cachedApps.length > 0) return cachedApps
  if (isWindows) {
    cachedApps = getWindowsApps()
  } else {
    cachedApps = getMacApps()
  }
  return cachedApps
}

export function searchApps(query: string): SearchResult[] {
  const apps = loadApps()
  const lower = query.toLowerCase()
  return apps
    .filter(app => app.name.toLowerCase().includes(lower))
    .slice(0, 20)
    .map(app => ({
      id: `app-${app.path}`,
      title: app.name,
      subtitle: app.path,
      type: 'app' as const,
      action: app.path,
      source: 'system' as const
    }))
}

export function launchApp(appPath: string): void {
  if (isWindows) {
    if (appPath.endsWith('.lnk')) {
      exec(`start "" "${appPath}"`)
    } else {
      exec(`"${appPath}"`)
    }
  } else {
    exec(`open "${appPath}"`)
  }
}
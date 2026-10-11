import { SearchResult, CustomCommand } from '../types'

const API = (window as any).api

export async function searchApps(query: string): Promise<SearchResult[]> {
  return await API.searchApps(query)
}

export async function launchApp(appPath: string): Promise<void> {
  await API.launchApp(appPath)
}

export async function searchCustomCommands(query: string): Promise<SearchResult[]> {
  return await API.searchCustomCommands(query)
}

export async function launchCustomCommand(item: SearchResult): Promise<void> {
  await API.launchCustomCommand(item)
}

export async function getCustomCommands(): Promise<CustomCommand[]> {
  return await API.getCustomCommands()
}

export async function saveCustomCommand(cmd: CustomCommand): Promise<void> {
  await API.saveCustomCommand(cmd)
}

export async function deleteCustomCommand(id: string): Promise<void> {
  await API.deleteCustomCommand(id)
}

export async function getRecents(): Promise<SearchResult[]> {
  return await API.getRecents()
}

export async function addRecent(item: SearchResult): Promise<void> {
  await API.addRecent(item)
}
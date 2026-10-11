import { useState, useEffect, useRef, useCallback } from 'react'

import { SearchResult } from './types'
import { searchApps, launchApp, searchCustomCommands, launchCustomCommand, getRecents, addRecent } from './utils/ipc'
import SearchBar from './components/SearchBar'
import ResultList from './components/ResultList'

export default function App() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [recents, setRecents] = useState<SearchResult[]>([])
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    getRecents().then(setRecents)
  }, [])

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const doSearch = useCallback(async (q: string) => {
    if (!q.trim()) {
      setResults([])
      return
    }
    const apps = await searchApps(q)
    const customs = await searchCustomCommands(q)
    setResults([...customs, ...apps])
    setSelectedIndex(0)
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => doSearch(query), 100)
    return () => clearTimeout(timer)
  }, [query, doSearch])

  const handleSelect = useCallback(async (item: SearchResult) => {
    if (item.source === 'system') {
      await launchApp(item.action)
    } else {
      await launchCustomCommand(item)
    }
    await addRecent(item)
    setQuery('')
    setResults([])
    setSelectedIndex(0)
    window.api.hideWindow()
  }, [])

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      window.api.hideWindow()
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex(i => Math.min(i + 1, results.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex(i => Math.max(i - 1, 0))
    } else if (e.key === 'Enter') {
      const list = results.length > 0 ? results : recents
      if (list[selectedIndex]) {
        handleSelect(list[selectedIndex])
      }
    }
  }, [results, recents, selectedIndex, handleSelect])

  const displayList = query.trim() ? results : recents

  return (
    <div className="app-container" onKeyDown={handleKeyDown}>
      <SearchBar ref={inputRef} value={query} onChange={setQuery} />
      <ResultList
        items={displayList}
        selectedIndex={selectedIndex}
        onSelect={handleSelect}
        emptyHint={query.trim() ? '没有找到结果' : '开始搜索...'}
      />
    </div>
  )
}
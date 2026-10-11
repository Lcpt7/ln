import { SearchResult } from '../types'

interface ResultListProps {
  items: SearchResult[]
  selectedIndex: number
  onSelect: (item: SearchResult) => void
  emptyHint?: string
}

export default function ResultList({ items, selectedIndex, onSelect, emptyHint }: ResultListProps) {
  if (items.length === 0) {
    return <div className="empty-hint">{emptyHint || '没有找到结果'}</div>
  }

  return (
    <div className="result-list">
      {items.map((item, index) => (
        <div
          key={item.id}
          className={`result-item ${index === selectedIndex ? 'selected' : ''}`}
          onClick={() => onSelect(item)}
        >
          <div className="result-icon">
            {item.type === 'app' && <AppIcon />}
            {item.type === 'url' && <UrlIcon />}
            {item.type === 'shell' && <ShellIcon />}
          </div>
          <div className="result-info">
            <div className="result-title">{item.title}</div>
            {item.subtitle && <div className="result-subtitle">{item.subtitle}</div>}
          </div>
          <div className="result-type">{item.source === 'custom' ? '自定义' : '系统'}</div>
        </div>
      ))}
    </div>
  )
}

function AppIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  )
}

function UrlIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  )
}

function ShellIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="4 17 10 11 4 5" />
      <line x1="12" y1="19" x2="20" y2="19" />
    </svg>
  )
}
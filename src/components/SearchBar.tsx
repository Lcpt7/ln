import { forwardRef } from 'react'

interface SearchBarProps {
  value: string
  onChange: (v: string) => void
}

const SearchBar = forwardRef<HTMLInputElement, SearchBarProps>(({ value, onChange }, ref) => {
  return (
    <div className="search-bar">
      <svg className="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
      <input
        ref={ref}
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder="搜索应用或命令..."
        spellCheck={false}
      />
    </div>
  )
})

SearchBar.displayName = 'SearchBar'

export default SearchBar
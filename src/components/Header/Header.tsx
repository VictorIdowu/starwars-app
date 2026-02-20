import { useState, useRef, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { FaSearch, FaTimes, FaHistory, FaStar } from 'react-icons/fa'
import { GiDeathStar } from 'react-icons/gi'
import { useDebounce } from '../../hooks/useDebounce'
import { useApp } from '../../context/AppContext'

interface HeaderProps {
  onOpenSidebar: () => void
}

const Header = ({ onOpenSidebar }: HeaderProps) => {
  const navigate = useNavigate()
  const location = useLocation()
  const { searchHistory, addToSearchHistory, favorites } = useApp()

  const [query, setQuery] = useState('')
  const [showDropdown, setShowDropdown] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)

  const debouncedQuery = useDebounce(query, 400)

  useEffect(() => {
    if (location.pathname !== '/search') setQuery('')
  }, [location.pathname])

  useEffect(() => {
    const trimmed = debouncedQuery.trim()
    if (trimmed) {
      navigate(`/search?q=${encodeURIComponent(trimmed)}`)
      addToSearchHistory(trimmed)
    } else if (debouncedQuery === '' && location.pathname === '/search') {
      navigate('/')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQuery])

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const filteredHistory = searchHistory.filter(
    (h) => h.toLowerCase().includes(query.toLowerCase()) && h !== query,
  )

  const handleSelect = (value: string) => {
    setQuery(value)
    setShowDropdown(false)
    navigate(`/search?q=${encodeURIComponent(value)}`)
  }

  const handleClear = () => {
    setQuery('')
    setShowDropdown(false)
    navigate('/')
    inputRef.current?.focus()
  }

  return (
    <header className="fixed top-0 left-0 right-0 h-header bg-surface border-b border-border flex items-center px-4 sm:px-8 gap-4 sm:gap-10 z-[1000] shadow-[0_2px_16px_rgba(0,0,0,0.6)]">
      {/* Logo */}
      <div
        className="flex items-center gap-3 cursor-pointer flex-shrink-0 group"
        onClick={() => navigate('/')}
      >
        <GiDeathStar className="text-[1.8rem] text-accent drop-shadow-[0_0_6px_rgba(255,232,31,0.5)]" />
        <div className="hidden sm:flex flex-col leading-none">
          <span className="font-orbitron text-accent text-base font-bold tracking-[2px] uppercase transition-colors group-hover:text-white">
            Star Wars
          </span>
          <span className="text-muted text-[0.55rem] tracking-[5px] uppercase mt-0.5">
            Universe
          </span>
        </div>
      </div>

      {/* Search */}
      <div className="flex-1 relative max-w-xl" ref={wrapperRef}>
        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-muted text-sm pointer-events-none z-10" />
        <input
          ref={inputRef}
          type="text"
          placeholder="Search characters..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setShowDropdown(true)
          }}
          onFocus={() => setShowDropdown(true)}
          autoComplete="off"
          className="w-full py-2.5 pl-10 pr-10 bg-surface-2 border border-border rounded-full text-white font-rajdhani text-sm outline-none transition-all placeholder:text-muted focus:border-accent focus:bg-surface-3 focus:ring-2 focus:ring-accent/20"
        />
        {query && (
          <button
            onClick={handleClear}
            aria-label="Clear search"
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted p-1 rounded-full hover:text-white hover:bg-surface-3 transition-colors text-xs flex items-center justify-center"
          >
            <FaTimes />
          </button>
        )}

        {/* Search history dropdown */}
        {showDropdown && filteredHistory.length > 0 && (
          <div className="absolute top-[calc(100%+0.5rem)] left-0 right-0 bg-surface border border-border rounded-xl overflow-hidden z-[200] shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
            <div className="text-[0.7rem] uppercase tracking-[2px] text-muted px-4 py-3">
              Recent searches
            </div>
            {filteredHistory.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 px-4 py-2.5 cursor-pointer hover:bg-surface-2 transition-colors text-sm"
                onMouseDown={() => handleSelect(item)}
              >
                <FaHistory className="text-muted text-xs flex-shrink-0" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Mobile favourites button */}
      <button
        onClick={onOpenSidebar}
        aria-label="Open favourites"
        className="md:hidden relative flex items-center justify-center w-10 h-10 rounded-full bg-surface-2 border border-border text-accent flex-shrink-0 hover:bg-surface-3 hover:border-accent transition-colors"
      >
        <FaStar />
        {favorites.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-danger text-white text-[0.6rem] font-bold min-w-4 h-4 rounded-full flex items-center justify-center px-1 leading-none">
            {favorites.length}
          </span>
        )}
      </button>
    </header>
  )
}

export default Header

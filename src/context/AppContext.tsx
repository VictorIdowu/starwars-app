import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import type { Character } from '../types'

interface AppContextValue {
  favorites: Character[]
  addFavorite: (character: Character) => void
  removeFavorite: (characterUrl: string) => void
  isFavorite: (characterUrl: string) => boolean
  searchHistory: string[]
  addToSearchHistory: (query: string) => void
}

const AppContext = createContext<AppContextValue | null>(null)

const getCharacterId = (url: string): string => {
  const parts = url.split('/').filter(Boolean)
  return parts[parts.length - 1]
}

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [favorites, setFavorites] = useState<Character[]>(() => {
    try {
      const saved = localStorage.getItem('sw-favorites')
      return saved ? (JSON.parse(saved) as Character[]) : []
    } catch {
      return []
    }
  })

  const [searchHistory, setSearchHistory] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('sw-search-history')
      return saved ? (JSON.parse(saved) as string[]) : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem('sw-favorites', JSON.stringify(favorites))
  }, [favorites])

  useEffect(() => {
    localStorage.setItem('sw-search-history', JSON.stringify(searchHistory))
  }, [searchHistory])

  const addFavorite = (character: Character) => {
    setFavorites((prev) => {
      const id = getCharacterId(character.url)
      if (prev.find((f) => getCharacterId(f.url) === id)) return prev
      return [...prev, character]
    })
  }

  const removeFavorite = (characterUrl: string) => {
    const id = getCharacterId(characterUrl)
    setFavorites((prev) => prev.filter((f) => getCharacterId(f.url) !== id))
  }

  const isFavorite = (characterUrl: string): boolean => {
    const id = getCharacterId(characterUrl)
    return favorites.some((f) => getCharacterId(f.url) === id)
  }

  const addToSearchHistory = (query: string) => {
    if (!query.trim()) return
    setSearchHistory((prev) => {
      const filtered = prev.filter((h) => h !== query)
      return [query, ...filtered].slice(0, 10)
    })
  }

  return (
    <AppContext.Provider
      value={{ favorites, addFavorite, removeFavorite, isFavorite, searchHistory, addToSearchHistory }}
    >
      {children}
    </AppContext.Provider>
  )
}

export const useApp = (): AppContextValue => {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}

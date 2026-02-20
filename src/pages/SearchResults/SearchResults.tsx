import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { FaSearch } from 'react-icons/fa'
import { GiGalaxy } from 'react-icons/gi'
import { searchCharacters } from '../../services/api'
import CharacterCard from '../../components/CharacterCard/CharacterCard'
import ViewToggle from '../../components/ViewToggle/ViewToggle'
import type { Character, ViewMode } from '../../types'

const SearchResults = () => {
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q') ?? ''

  const [characters, setCharacters] = useState<Character[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<ViewMode>('list')

  useEffect(() => {
    if (!query.trim()) {
      setCharacters([])
      return
    }
    let cancelled = false
    const search = async () => {
      setLoading(true)
      setError(null)
      try {
        const data = await searchCharacters(query)
        if (!cancelled) setCharacters(data.results)
      } catch {
        if (!cancelled) setError('Search failed. Please try again.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    search()
    return () => { cancelled = true }
  }, [query])

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="font-orbitron text-3xl font-bold text-accent mb-1.5 tracking-wide flex items-center gap-3">
            <FaSearch className="text-2xl" /> Search Results
          </h1>
          {query && (
            <p className="text-muted text-sm">
              Showing results for <strong className="text-white">"{query}"</strong>
            </p>
          )}
        </div>
        {characters.length > 0 && <ViewToggle viewMode={viewMode} onToggle={setViewMode} />}
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex flex-col items-center justify-center gap-5 py-20 text-muted text-sm tracking-wide">
          <div className="w-12 h-12 rounded-full border-[3px] border-border border-t-accent animate-spin-fast" />
          <p>Scanning the galaxy…</p>
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="mx-4 my-8 p-6 text-center text-danger bg-danger/10 border border-danger/30 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* No results */}
      {!loading && !error && query && characters.length === 0 && (
        <div className="flex flex-col items-center gap-3 py-20 text-muted text-center">
          <GiGalaxy className="text-[4rem] text-border mb-2" />
          <p className="text-base">No characters found for "{query}"</p>
          <p className="text-sm opacity-70">Try a different search term</p>
        </div>
      )}

      {/* Results */}
      {!loading && !error && characters.length > 0 && (
        <>
          <p className="text-muted text-sm mb-4">
            {characters.length} character{characters.length !== 1 ? 's' : ''} found
          </p>
          <div
            className={
              viewMode === 'list'
                ? 'flex flex-col gap-3'
                : 'flex flex-col gap-3 md:grid md:grid-cols-2 md:gap-3.5 xl:grid-cols-3'
            }
          >
            {characters.map((char) => (
              <CharacterCard key={char.url} character={char} />
            ))}
          </div>
        </>
      )}

      {/* Empty state */}
      {!query && (
        <div className="flex flex-col items-center gap-3 py-20 text-muted text-center">
          <GiGalaxy className="text-[4rem] text-border mb-2" />
          <p className="text-base">Start typing in the search bar above to find characters</p>
        </div>
      )}
    </div>
  )
}

export default SearchResults

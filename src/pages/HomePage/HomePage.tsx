import { useState, useEffect } from 'react'
import { fetchCharacters } from '../../services/api'
import CharacterCard from '../../components/CharacterCard/CharacterCard'
import Pagination from '../../components/Pagination/Pagination'
import ViewToggle from '../../components/ViewToggle/ViewToggle'
import type { Character, ViewMode } from '../../types'

const ITEMS_PER_PAGE = 10

const HomePage = () => {
  const [characters, setCharacters] = useState<Character[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const [viewMode, setViewMode] = useState<ViewMode>('list')

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE)

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      setLoading(true)
      setError(null)
      try {
        const data = await fetchCharacters(currentPage)
        if (!cancelled) {
          setCharacters(data.results)
          setTotalCount(data.count)
        }
      } catch {
        if (!cancelled) setError('Failed to load characters. Please try again.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [currentPage])

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center gap-5 py-20 text-muted text-sm tracking-wide">
        <div className="w-12 h-12 rounded-full border-[3px] border-border border-t-accent animate-spin-fast" />
        <p>Loading characters from a galaxy far, far away…</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="mx-4 my-8 p-6 text-center text-danger bg-danger/10 border border-danger/30 rounded-lg text-sm">
        {error}
      </div>
    )
  }

  return (
    <div className="animate-fade-in">
      <div className="flex items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="font-orbitron text-3xl font-bold text-accent mb-1.5 tracking-wide">
            Characters
          </h1>
          <p className="text-muted text-sm">{totalCount} characters across the galaxy</p>
        </div>
        <ViewToggle viewMode={viewMode} onToggle={setViewMode} />
      </div>

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

      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
    </div>
  )
}

export default HomePage

import { Link } from 'react-router-dom'
import { FaHeart, FaRegHeart } from 'react-icons/fa'
import { GiPerson } from 'react-icons/gi'
import { useApp } from '../../context/AppContext'
import { getCharacterId } from '../../services/api'
import type { Character } from '../../types'

interface CharacterCardProps {
  character: Character
}

const CharacterCard = ({ character }: CharacterCardProps) => {
  const { isFavorite, addFavorite, removeFavorite } = useApp()
  const id = getCharacterId(character.url)
  const favorited = isFavorite(character.url)

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (favorited) removeFavorite(character.url)
    else addFavorite(character)
  }

  return (
    <Link
      to={`/character/${id}`}
      className="group flex items-center gap-5 bg-surface border border-border rounded-xl p-4 transition-all duration-200 hover:border-accent/50 hover:-translate-y-0.5 hover:shadow-[0_0_20px_rgba(255,232,31,0.1)]"
    >
      {/* Avatar */}
      <div className="relative w-14 h-14 rounded-full bg-surface-2 border-2 border-accent flex items-center justify-center flex-shrink-0">
        <GiPerson className="text-2xl text-accent" />
        <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 font-orbitron text-[0.5rem] bg-accent text-black px-1.5 py-px rounded font-bold whitespace-nowrap">
          #{id}
        </span>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h3 className="text-base font-semibold mb-1.5 truncate transition-colors group-hover:text-accent">
          {character.name}
        </h3>
        <div className="flex gap-1.5 flex-wrap">
          {character.gender !== 'n/a' && (
            <span className="text-xs text-muted bg-surface-2 px-2 py-0.5 rounded-full capitalize">
              {character.gender}
            </span>
          )}
          {character.birth_year !== 'unknown' && (
            <span className="text-xs text-muted bg-surface-2 px-2 py-0.5 rounded-full">
              {character.birth_year}
            </span>
          )}
          {character.height !== 'unknown' && (
            <span className="text-xs text-muted bg-surface-2 px-2 py-0.5 rounded-full">
              {character.height} cm
            </span>
          )}
        </div>
      </div>

      {/* Favourite toggle */}
      <button
        onClick={toggleFavorite}
        aria-label={favorited ? 'Remove from favourites' : 'Add to favourites'}
        className={`p-2 text-lg flex-shrink-0 transition-all duration-200 hover:scale-110 ${
          favorited ? 'text-danger' : 'text-muted hover:text-danger'
        }`}
      >
        {favorited ? <FaHeart /> : <FaRegHeart />}
      </button>
    </Link>
  )
}

export default CharacterCard

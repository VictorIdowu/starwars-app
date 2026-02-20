import { Link } from 'react-router-dom'
import { FaTrash, FaStar, FaTimes } from 'react-icons/fa'
import { useApp } from '../../context/AppContext'
import { getCharacterId } from '../../services/api'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const { favorites, removeFavorite } = useApp()

  return (
    <aside
      className={[
        'fixed top-header left-0 bottom-0 w-sidebar bg-surface border-r border-border',
        'p-4 overflow-y-auto transition-transform duration-[280ms] ease-[cubic-bezier(0.4,0,0.2,1)]',
        'z-[600] md:z-[100] shadow-[4px_0_24px_rgba(0,0,0,0.6)] md:shadow-none',
        isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
      ].join(' ')}
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-5 pb-4 border-b border-border">
        <FaStar className="text-accent text-sm" />
        <h2 className="font-orbitron text-[0.7rem] font-semibold uppercase tracking-[2px] text-muted flex-1">
          Favourites
        </h2>
        {favorites.length > 0 && (
          <span className="bg-accent text-black text-[0.7rem] font-bold min-w-5 h-5 rounded-full flex items-center justify-center px-1">
            {favorites.length}
          </span>
        )}
        <button
          onClick={onClose}
          aria-label="Close favourites"
          className="md:hidden flex items-center justify-center w-7 h-7 rounded-full text-muted hover:text-white hover:bg-surface-3 transition-colors text-xs"
        >
          <FaTimes />
        </button>
      </div>

      {favorites.length === 0 ? (
        <p className="text-[0.82rem] text-muted leading-relaxed text-center px-2 py-4">
          No favourites yet. Hit the ♥ icon on any character to save them here.
        </p>
      ) : (
        <ul className="flex flex-col gap-1.5">
          {favorites.map((char) => (
            <li
              key={char.url}
              className="flex items-center gap-1.5 bg-surface-2 border border-transparent rounded-lg px-2.5 py-2 hover:border-border hover:bg-surface-3 transition-all"
            >
              <Link
                to={`/character/${getCharacterId(char.url)}`}
                onClick={onClose}
                title={char.name}
                className="flex items-center gap-1.5 flex-1 min-w-0 group"
              >
                <span className="font-orbitron text-[0.6rem] text-muted flex-shrink-0">
                  #{getCharacterId(char.url)}
                </span>
                <span className="text-[0.85rem] font-medium truncate group-hover:text-accent transition-colors">
                  {char.name}
                </span>
              </Link>
              <button
                onClick={() => removeFavorite(char.url)}
                aria-label={`Remove ${char.name} from favourites`}
                className="text-muted text-[0.7rem] p-1.5 rounded hover:text-danger hover:bg-danger/10 transition-colors flex-shrink-0"
              >
                <FaTrash />
              </button>
            </li>
          ))}
        </ul>
      )}
    </aside>
  )
}

export default Sidebar

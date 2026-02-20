import { FaList, FaTh } from 'react-icons/fa'
import type { ViewMode } from '../../types'

interface ViewToggleProps {
  viewMode: ViewMode
  onToggle: (mode: ViewMode) => void
}

const ViewToggle = ({ viewMode, onToggle }: ViewToggleProps) => {
  const btn = (mode: ViewMode) =>
    `flex items-center justify-center w-9 h-[34px] text-sm transition-all ${
      viewMode === mode
        ? 'bg-accent text-black'
        : 'text-muted hover:text-white hover:bg-surface-3'
    }`

  return (
    <div className="hidden md:flex items-center bg-surface-2 border border-border rounded-lg overflow-hidden flex-shrink-0">
      <button
        className={btn('list')}
        onClick={() => onToggle('list')}
        aria-label="List view"
        title="List view"
      >
        <FaList />
      </button>
      <button
        className={`${btn('grid')} border-l border-border`}
        onClick={() => onToggle('grid')}
        aria-label="Grid view"
        title="Grid view"
      >
        <FaTh />
      </button>
    </div>
  )
}

export default ViewToggle

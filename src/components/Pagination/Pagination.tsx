import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
  const delta = 2
  const pages: number[] = []
  for (
    let i = Math.max(1, currentPage - delta);
    i <= Math.min(totalPages, currentPage + delta);
    i++
  ) {
    pages.push(i)
  }

  const navBtn =
    'flex items-center gap-1.5 px-4 py-2 bg-surface border border-border rounded-lg text-sm font-medium transition-all hover:border-accent hover:text-accent disabled:opacity-30 disabled:cursor-not-allowed'

  const pageBtn = (active: boolean) =>
    `w-9 h-9 flex items-center justify-center rounded-lg text-sm font-medium transition-all ${
      active
        ? 'bg-accent text-black font-bold border border-accent'
        : 'border border-transparent hover:border-border hover:bg-surface-2'
    }`

  return (
    <div className="flex items-center justify-center gap-3 py-10">
      <button
        className={navBtn}
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        aria-label="Previous page"
      >
        <FaChevronLeft />
        <span>Prev</span>
      </button>

      <div className="flex items-center gap-1">
        {pages[0] > 1 && (
          <>
            <button className={pageBtn(false)} onClick={() => onPageChange(1)}>
              1
            </button>
            {pages[0] > 2 && <span className="text-muted text-sm px-1">…</span>}
          </>
        )}

        {pages.map((p) => (
          <button key={p} className={pageBtn(p === currentPage)} onClick={() => onPageChange(p)}>
            {p}
          </button>
        ))}

        {pages[pages.length - 1] < totalPages && (
          <>
            {pages[pages.length - 1] < totalPages - 1 && (
              <span className="text-muted text-sm px-1">…</span>
            )}
            <button className={pageBtn(false)} onClick={() => onPageChange(totalPages)}>
              {totalPages}
            </button>
          </>
        )}
      </div>

      <button
        className={navBtn}
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        aria-label="Next page"
      >
        <span>Next</span>
        <FaChevronRight />
      </button>
    </div>
  )
}

export default Pagination

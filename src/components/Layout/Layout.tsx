import { useState } from 'react'
import Header from '../Header/Header'
import Sidebar from '../Sidebar/Sidebar'

const Layout = ({ children }: { children: React.ReactNode }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex flex-col min-h-screen bg-bg">
      <Header onOpenSidebar={() => setSidebarOpen(true)} />

      <div className="flex flex-1 pt-header">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* Mobile overlay */}
        {sidebarOpen && (
          <div
            className="md:hidden fixed top-header left-0 right-0 bottom-0 bg-black/70 backdrop-blur-sm z-[500] animate-fade-in"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <main className="flex-1 p-6 md:p-10 md:ml-sidebar min-w-0 animate-fade-in">
          {children}
        </main>
      </div>
    </div>
  )
}

export default Layout

import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Navbar from './Navbar'

/**
 * MainLayout Component
 * ====================
 * The main layout for authenticated pages.
 * Contains sidebar navigation and top navbar.
 */
const MainLayout = () => {
  return (
    <div className="min-h-screen bg-gray-950 flex">
      {/* Sidebar - Fixed on desktop */}
      <Sidebar />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:ml-64">
        {/* Top Navbar */}
        <Navbar />
        
        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-8 overflow-auto">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}

export default MainLayout


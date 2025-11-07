import { Link } from 'react-router-dom'

export default function Navbar() {
  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-green-600">
          🥗 NutriSaarthi
        </Link>
        <div className="space-x-4">
          <Link to="/dashboard" className="text-gray-600 hover:text-gray-900">Dashboard</Link>
          <Link to="/meals" className="text-gray-600 hover:text-gray-900">Meals</Link>
          <Link to="/water" className="text-gray-600 hover:text-gray-900">Water</Link>
          <Link to="/profile" className="text-gray-600 hover:text-gray-900">Profile</Link>
        </div>
      </div>
    </nav>
  )
}

import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import Button from '../ui/Button'

const Navbar: React.FC = () => {
  const location = useLocation()
  const isActive = (path: string) => location.pathname === path

  return (
    <nav className="bg-white shadow-lg border-b sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              CourseHub
            </span>
          </Link>
          <div className="hidden md:flex items-center space-x-1">
            <Link to="/" className={`px-4 py-2 rounded-lg ${isActive('/') ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`}>
              Dashboard
            </Link>
            <Link to="/courses" className={`px-4 py-2 rounded-lg ${isActive('/courses') ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`}>
              Courses
            </Link>
          </div>
          <Link to="/courses/new">
            <Button size="sm">+ New Course</Button>
          </Link>
        </div>
      </div>
    </nav>
  )
}

export default Navbar


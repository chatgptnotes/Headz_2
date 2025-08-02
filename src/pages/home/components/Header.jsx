import React from 'react'
import { Link } from 'react-router-dom'

const Header = () => {
  return (
    <header className="bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
              <span className="text-purple-600 font-bold text-xl">H</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold">HeadZ</h1>
              <p className="text-sm text-purple-200">Try Before You Style</p>
            </div>
          </div>
          
          {/* Header Actions */}
          <div className="flex items-center space-x-4">
            <Link to="/trynow" className="bg-white text-purple-600 px-4 py-2 rounded-lg font-semibold hover:bg-purple-50 hover:shadow-lg transform hover:scale-105 transition-all duration-200">
              Try Hair Now
            </Link>
            <Link to="/login" className="bg-transparent border-2 border-white text-white px-4 py-2 rounded-lg font-semibold hover:bg-white hover:text-purple-600 transition-colors">
              Login
            </Link>
            <Link to="/signup" className="bg-blue-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-400 transition-colors shadow-md">
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header 
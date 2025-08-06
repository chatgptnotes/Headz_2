import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const location = useLocation()

  const menuItems = [
    { name: 'Home', href: '/', isRoute: true },
    { name: 'Try Hair', href: '/trynow', isRoute: true },
    { name: 'Styles', href: '/styles', isRoute: true },
    { name: 'Gallery', href: '/gallery', isRoute: true },
    { name: 'About', href: '/about', isRoute: true },
    { name: 'Contact', href: '/contact', isRoute: true }
  ]

  const isActiveRoute = (href) => {
    return location.pathname === href
  }

  return (
    <nav className="bg-white shadow-md border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {menuItems.map((item) => {
              const isActive = item.isRoute && isActiveRoute(item.href)
              const baseClasses = "font-medium transition-colors duration-200"
              const activeClasses = isActive 
                ? "text-purple-600 border-b-2 border-purple-600 pb-1" 
                : "text-gray-700 hover:text-purple-600"
              
              return item.isRoute ? (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`${baseClasses} ${activeClasses}`}
                >
                  {item.name}
                </Link>
              ) : (
                <a
                  key={item.name}
                  href={item.href}
                  className={`${baseClasses} ${activeClasses}`}
                >
                  {item.name}
                </a>
              )
            })}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-purple-600 focus:outline-none"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

          {/* Auth Buttons & Search Bar */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search hairstyles..."
                className="w-48 px-4 py-2 pl-10 pr-4 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <svg
                className="absolute left-3 top-2.5 h-4 w-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <Link 
              to="/login" 
              className="text-gray-700 hover:text-purple-600 font-medium transition-colors duration-200"
            >
              Login
            </Link>
            <Link 
              to="/signup" 
              className="bg-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-purple-700 transition-colors duration-200"
            >
              Sign Up
            </Link>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-gray-200">
              {menuItems.map((item) => {
                const isActive = item.isRoute && isActiveRoute(item.href)
                const activeClasses = isActive 
                  ? "text-purple-600 bg-purple-50" 
                  : "text-gray-700 hover:text-purple-600 hover:bg-purple-50"
                
                return item.isRoute ? (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`block px-3 py-2 font-medium transition-colors duration-200 rounded-lg ${activeClasses}`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ) : (
                  <a
                    key={item.name}
                    href={item.href}
                    className={`block px-3 py-2 font-medium transition-colors duration-200 rounded-lg ${activeClasses}`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </a>
                )
              })}
              <div className="px-3 py-2">
                <input
                  type="text"
                  placeholder="Search hairstyles..."
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div className="px-3 py-2 space-y-2">
                <Link
                  to="/login"
                  className="block w-full text-center px-4 py-2 text-gray-700 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="block w-full text-center px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
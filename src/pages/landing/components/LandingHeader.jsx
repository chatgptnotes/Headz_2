import React, { useState } from 'react'
import { useAuth } from '../../../contexts/AuthContext'

const LandingHeader = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { login } = useAuth()

  const handleTryNow = () => {
    login(); // This will trigger the Google OAuth flow
  };

  return (
    <header className="bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">

        {/* Main Header Content */}
        <div className="flex items-center justify-between py-4 sm:py-6">

          {/* Logo Section */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-purple-600 font-bold text-lg sm:text-xl">H</span>
            </div>
            <div className="min-w-0">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold truncate">HeadZ</h1>
              <p className="text-xs sm:text-sm text-purple-200 hidden sm:block">Try Before You Style</p>
            </div>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-3 lg:space-x-4">
            <button
              onClick={handleTryNow}
              className="bg-white text-purple-600 px-4 lg:px-6 py-2 lg:py-3 rounded-lg font-semibold hover:bg-purple-50 hover:shadow-lg transform hover:scale-105 transition-all duration-200 text-sm lg:text-base"
            >
              Try Hair Now
            </button>
            <button
              onClick={handleTryNow}
              className="bg-transparent border-2 border-white text-white px-4 lg:px-6 py-2 lg:py-3 rounded-lg font-semibold hover:bg-white hover:text-purple-600 transition-colors text-sm lg:text-base"
            >
              Login
            </button>
            <button
              onClick={handleTryNow}
              className="bg-blue-500 text-white px-4 lg:px-6 py-2 lg:py-3 rounded-lg font-semibold hover:bg-blue-400 transition-colors shadow-md text-sm lg:text-base"
            >
              Sign Up
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-white hover:text-purple-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-purple-600 rounded-md p-2 transition-colors duration-200"
              aria-label="Toggle mobile menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden transition-all duration-300 ease-in-out overflow-hidden ${
          isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className="pb-4 space-y-3 border-t border-purple-500/30 pt-4">

            {/* Mobile Tagline */}
            <p className="text-sm text-purple-200 sm:hidden mb-4">Try Before You Style</p>

            {/* Mobile Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={handleTryNow}
                className="block w-full bg-white text-purple-600 px-4 py-3 rounded-lg font-semibold text-center hover:bg-purple-50 transition-colors duration-200 shadow-md"
              >
                🎨 Try Hair Now
              </button>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleTryNow}
                  className="bg-transparent border-2 border-white text-white px-4 py-3 rounded-lg font-semibold text-center hover:bg-white hover:text-purple-600 transition-colors duration-200 text-sm"
                >
                  Login
                </button>
                <button
                  onClick={handleTryNow}
                  className="bg-blue-500 text-white px-4 py-3 rounded-lg font-semibold text-center hover:bg-blue-400 transition-colors duration-200 shadow-md text-sm"
                >
                  Sign Up
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default LandingHeader

import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../../components/common_components/navbar/Navbar'
import Footer from '../../components/common_components/footer/Footer'

const Styles = () => {
  const [activeTab, setActiveTab] = useState('trending')

  const styleCategories = {
    trending: {
      title: 'Trending Now',
      subtitle: 'The hottest hairstyles everyone is talking about',
      styles: [
        {
          id: 1,
          name: 'Wolf Cut',
          image: 'https://images.unsplash.com/photo-1570158268183-d296b2892211?w=400&h=400&fit=crop',
          popularity: 95,
          difficulty: 'Medium',
          faceShapes: ['Oval', 'Round', 'Heart'],
          description: 'Edgy layered cut with volume and texture'
        },
        {
          id: 2,
          name: 'Curtain Bangs',
          image: 'https://images.unsplash.com/photo-1548783307-f63adc3f200b?w=400&h=400&fit=crop',
          popularity: 88,
          difficulty: 'Easy',
          faceShapes: ['All'],
          description: 'Face-framing bangs that work with any style'
        },
        {
          id: 3,
          name: 'Textured Pixie',
          image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
          popularity: 82,
          difficulty: 'High',
          faceShapes: ['Oval', 'Heart'],
          description: 'Modern take on the classic pixie cut'
        },
        {
          id: 4,
          name: 'Shag Haircut',
          image: 'https://images.unsplash.com/photo-1587653263995-422546a7a569?w=400&h=400&fit=crop',
          popularity: 79,
          difficulty: 'Medium',
          faceShapes: ['Oval', 'Square'],
          description: 'Retro-inspired layers for effortless style'
        }
      ]
    },
    classic: {
      title: 'Classic Styles',
      subtitle: 'Timeless looks that never go out of fashion',
      styles: [
        {
          id: 5,
          name: 'Bob Cut',
          image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face',
          popularity: 92,
          difficulty: 'Easy',
          faceShapes: ['All'],
          description: 'Clean, versatile cut perfect for any occasion'
        },
        {
          id: 6,
          name: 'Layered Hair',
          image: 'https://images.unsplash.com/photo-1447871622716-5dc761437456?w=400&h=400&fit=crop',
          popularity: 89,
          difficulty: 'Medium',
          faceShapes: ['Oval', 'Round'],
          description: 'Adds movement and dimension to any length'
        },
        {
          id: 7,
          name: 'French Bob',
          image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face',
          popularity: 76,
          difficulty: 'Medium',
          faceShapes: ['Oval', 'Heart'],
          description: 'Chic Parisian-inspired short cut'
        },
        {
          id: 8,
          name: 'Long Layers',
          image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=400&fit=crop',
          popularity: 85,
          difficulty: 'Easy',
          faceShapes: ['All'],
          description: 'Flowing layers for natural movement'
        }
      ]
    },
    professional: {
      title: 'Professional Styles',
      subtitle: 'Polished looks perfect for the workplace',
      styles: [
        {
          id: 9,
          name: 'Sleek Straight',
          image: 'https://images.unsplash.com/photo-1566492031773-4f4e44671d66?w=400&h=400&fit=crop&crop=face',
          popularity: 91,
          difficulty: 'Easy',
          faceShapes: ['All'],
          description: 'Smooth, professional finish'
        },
        {
          id: 10,
          name: 'Low Bun',
          image: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=400&h=400&fit=crop&crop=face',
          popularity: 87,
          difficulty: 'Easy',
          faceShapes: ['All'],
          description: 'Elegant updo for formal occasions'
        },
        {
          id: 11,
          name: 'Side Part',
          image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face',
          popularity: 83,
          difficulty: 'Easy',
          faceShapes: ['Oval', 'Square'],
          description: 'Classic parting for a refined look'
        },
        {
          id: 12,
          name: 'Blowout Style',
          image: 'https://images.unsplash.com/photo-1539125530496-3ca408f9c2d9?w=400&h=400&fit=crop',
          popularity: 78,
          difficulty: 'Medium',
          faceShapes: ['All'],
          description: 'Voluminous, salon-fresh styling'
        }
      ]
    }
  }

  const currentStyles = styleCategories[activeTab].styles

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-600 bg-green-100'
      case 'Medium': return 'text-yellow-600 bg-yellow-100'
      case 'High': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">Browse Hairstyles</h1>
            <p className="text-xl leading-relaxed text-purple-100 mb-8">
              Discover the perfect hairstyle for your face shape, lifestyle, and personality. 
              From trending cuts to timeless classics, find your next look here.
            </p>
            <Link 
              to="/trynow" 
              className="inline-block bg-white text-purple-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors shadow-lg"
            >
              Try Styles Virtually
            </Link>
          </div>
        </div>
      </section>

      {/* Style Categories Tabs */}
      <section className="py-8 bg-white border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-wrap justify-center gap-4">
              {Object.entries(styleCategories).map(([key, category]) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`px-8 py-4 rounded-full font-semibold text-lg transition-all duration-200 ${
                    activeTab === key
                      ? 'bg-purple-600 text-white shadow-lg transform scale-105'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category.title}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Style Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                {styleCategories[activeTab].title}
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                {styleCategories[activeTab].subtitle}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {currentStyles.map((style) => (
                <div
                  key={style.id}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group"
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={style.image}
                      alt={style.name}
                      className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute top-4 right-4 bg-white rounded-full px-3 py-1 shadow-lg">
                      <div className="flex items-center space-x-1">
                        <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                        </svg>
                        <span className="text-sm font-medium text-gray-700">{style.popularity}%</span>
                      </div>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute bottom-4 left-4 right-4">
                        <Link
                          to="/trynow"
                          className="w-full bg-white text-purple-600 py-2 rounded-lg font-semibold text-center block hover:bg-gray-100 transition-colors"
                        >
                          Try This Style
                        </Link>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{style.name}</h3>
                    <p className="text-gray-600 mb-4 text-sm leading-relaxed">{style.description}</p>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-500">Difficulty:</span>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(style.difficulty)}`}>
                          {style.difficulty}
                        </span>
                      </div>
                      
                      <div>
                        <span className="text-sm font-medium text-gray-500 block mb-1">Best for:</span>
                        <div className="flex flex-wrap gap-1">
                          {style.faceShapes.map((shape, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-purple-100 text-purple-600 rounded text-xs font-medium"
                            >
                              {shape}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Face Shape Guide */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Find Your Face Shape</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Understanding your face shape is key to choosing the perfect hairstyle
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
              {[
                { shape: 'Oval', image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200&h=200&fit=crop&crop=face', description: 'Balanced proportions, versatile styling' },
                { shape: 'Round', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face', description: 'Soft curves, add height with volume' },
                { shape: 'Square', image: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=200&h=200&fit=crop&crop=face', description: 'Strong jawline, soften with layers' },
                { shape: 'Heart', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face', description: 'Wide forehead, balance with width' },
                { shape: 'Diamond', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face', description: 'Narrow forehead, add fullness' }
              ].map((face, index) => (
                <div key={index} className="text-center bg-gray-50 p-6 rounded-2xl hover:bg-purple-50 transition-colors">
                  <img
                    src={face.image}
                    alt={`${face.shape} face shape`}
                    className="w-20 h-20 rounded-full mx-auto mb-4 object-cover"
                  />
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{face.shape}</h3>
                  <p className="text-sm text-gray-600">{face.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Style Tips */}
      <section className="py-20 bg-gradient-to-r from-purple-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Styling Tips</h2>
              <p className="text-xl text-gray-600">Expert advice to help you choose and maintain your perfect hairstyle</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: '✂️',
                  title: 'Consider Your Lifestyle',
                  tip: 'Choose a style that fits your daily routine and maintenance preferences'
                },
                {
                  icon: '💡',
                  title: 'Hair Texture Matters',
                  tip: 'Work with your natural hair texture rather than against it for better results'
                },
                {
                  icon: '🎯',
                  title: 'Face Shape First',
                  tip: 'Your face shape is the most important factor in choosing a flattering cut'
                },
                {
                  icon: '🌟',
                  title: 'Professional Consultation',
                  tip: 'Always consult with a stylist before making dramatic changes'
                },
                {
                  icon: '📅',
                  title: 'Maintenance Schedule',
                  tip: 'Plan regular touch-ups to keep your style looking fresh and healthy'
                },
                {
                  icon: '💎',
                  title: 'Quality Products',
                  tip: 'Invest in good styling products designed for your hair type'
                }
              ].map((tip, index) => (
                <div key={index} className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition-shadow">
                  <div className="text-3xl mb-4">{tip.icon}</div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3">{tip.title}</h3>
                  <p className="text-gray-600">{tip.tip}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Found Your Perfect Style?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-purple-100">
            See how any of these hairstyles would look on you with our AI try-on technology
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/trynow" 
              className="bg-white text-purple-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors"
            >
              Try Styles Now
            </Link>
            <Link 
              to="/gallery" 
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-purple-600 transition-all duration-200"
            >
              View Gallery
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default Styles
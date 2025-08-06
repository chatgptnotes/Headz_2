import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../../components/common_components/navbar/Navbar'
import Footer from '../../components/common_components/footer/Footer'

const Gallery = () => {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedImage, setSelectedImage] = useState(null)

  const categories = [
    { id: 'all', name: 'All Styles', count: 24 },
    { id: 'short', name: 'Short Hair', count: 8 },
    { id: 'medium', name: 'Medium Hair', count: 7 },
    { id: 'long', name: 'Long Hair', count: 5 },
    { id: 'curly', name: 'Curly & Wavy', count: 4 }
  ]

  const galleryImages = [
    {
      id: 1,
      title: 'Classic Pixie Cut',
      category: 'short',
      before: 'https://images.unsplash.com/photo-1594149221886-eb520f85ad25?w=400&h=400&fit=crop&crop=face',
      after: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
      description: 'Perfect for a bold, modern look'
    },
    {
      id: 2,
      title: 'Textured Bob',
      category: 'short',
      before: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face',
      after: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face',
      description: 'Chic and versatile everyday style'
    },
    {
      id: 3,
      title: 'Slicked Back Style',
      category: 'short',
      before: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
      after: 'https://images.unsplash.com/photo-1566492031773-4f4e44671d66?w=400&h=400&fit=crop&crop=face',
      description: 'Professional and sophisticated'
    },
    {
      id: 4,
      title: 'Messy Fringe',
      category: 'short',
      before: 'https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?w=400&h=400&fit=crop&crop=face',
      after: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face',
      description: 'Casual and trendy appearance'
    },
    {
      id: 5,
      title: 'Shoulder Length Waves',
      category: 'medium',
      before: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=400&h=400&fit=crop&crop=face',
      after: 'https://images.unsplash.com/photo-1570158268183-d296b2892211?w=400&h=400&fit=crop',
      description: 'Elegant waves for any occasion'
    },
    {
      id: 6,
      title: 'Layered Medium Cut',
      category: 'medium',
      before: 'https://images.unsplash.com/photo-1601288496920-b6154fe3626a?w=400&h=400&fit=crop&crop=face',
      after: 'https://images.unsplash.com/photo-1548783307-f63adc3f200b?w=400&h=400&fit=crop',
      description: 'Volume and movement'
    },
    {
      id: 7,
      title: 'Beach Waves',
      category: 'medium',
      before: 'https://images.unsplash.com/photo-1581403341630-a6e0b9d2d6db?w=400&h=400&fit=crop&crop=face',
      after: 'https://images.unsplash.com/photo-1587653263995-422546a7a569?w=400&h=400&fit=crop',
      description: 'Effortless, natural texture'
    },
    {
      id: 8,
      title: 'Straight Lob',
      category: 'medium',
      before: 'https://images.unsplash.com/photo-1614644147798-f8c0fc9da7f6?w=400&h=400&fit=crop&crop=face',
      after: 'https://images.unsplash.com/photo-1447871622716-5dc761437456?w=400&h=400&fit=crop',
      description: 'Clean, sharp lines'
    },
    {
      id: 9,
      title: 'Long Layered Hair',
      category: 'long',
      before: 'https://images.unsplash.com/photo-1619895862022-09114b41f16f?w=400&h=400&fit=crop&crop=face',
      after: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=400&fit=crop',
      description: 'Classic long hairstyle'
    },
    {
      id: 10,
      title: 'Cascading Curls',
      category: 'long',
      before: 'https://images.unsplash.com/photo-1556157382-97eda2d62296?w=400&h=400&fit=crop&crop=face',
      after: 'https://images.unsplash.com/photo-1539125530496-3ca408f9c2d9?w=400&h=400&fit=crop',
      description: 'Romantic flowing curls'
    },
    {
      id: 11,
      title: 'Voluminous Curls',
      category: 'curly',
      before: 'https://images.unsplash.com/photo-1583864697784-a0efc8379f70?w=400&h=400&fit=crop&crop=face',
      after: 'https://images.unsplash.com/photo-1600679620924-47bf7fcbd629?w=400&h=400&fit=crop',
      description: 'Full, bouncy curls'
    },
    {
      id: 12,
      title: 'Defined Coils',
      category: 'curly',
      before: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&h=400&fit=crop&crop=face',
      after: 'https://images.unsplash.com/photo-1640008404828-3d3cc5a11fd4?w=400&h=400&fit=crop',
      description: 'Beautiful natural texture'
    }
  ]

  const filteredImages = selectedCategory === 'all' 
    ? galleryImages 
    : galleryImages.filter(img => img.category === selectedCategory)

  const openModal = (image) => {
    setSelectedImage(image)
    document.body.style.overflow = 'hidden'
  }

  const closeModal = () => {
    setSelectedImage(null)
    document.body.style.overflow = 'unset'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">Hair Transformation Gallery</h1>
            <p className="text-xl leading-relaxed text-purple-100 mb-8">
              See real transformations from our AI hairstyle technology. 
              Browse before and after photos from thousands of satisfied users.
            </p>
            <Link 
              to="/trynow" 
              className="inline-block bg-white text-purple-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors shadow-lg"
            >
              Try Your Own Transformation
            </Link>
          </div>
        </div>
      </section>

      {/* Filter Categories */}
      <section className="py-12 bg-white border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">Browse by Style</h2>
            <div className="flex flex-wrap justify-center gap-4">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-6 py-3 rounded-full font-medium transition-all duration-200 ${
                    selectedCategory === category.id
                      ? 'bg-purple-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category.name}
                  <span className="ml-2 text-sm opacity-75">({category.count})</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredImages.map((image) => (
                <div
                  key={image.id}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group"
                  onClick={() => openModal(image)}
                >
                  <div className="relative">
                    <div className="grid grid-cols-2 h-64">
                      <div className="relative overflow-hidden">
                        <img
                          src={image.before}
                          alt="Before"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-3 left-3 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                          Before
                        </div>
                      </div>
                      <div className="relative overflow-hidden">
                        <img
                          src={image.after}
                          alt="After"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-3 right-3 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                          After
                        </div>
                      </div>
                    </div>
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                      <div className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{image.title}</h3>
                    <p className="text-gray-600 mb-4">{image.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="inline-block bg-purple-100 text-purple-600 px-3 py-1 rounded-full text-sm font-medium capitalize">
                        {image.category} Hair
                      </span>
                      <button className="text-purple-600 font-medium hover:text-purple-800 transition-colors">
                        View Details →
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="relative">
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                <div className="relative">
                  <img
                    src={selectedImage.before}
                    alt="Before transformation"
                    className="w-full h-96 md:h-full object-cover"
                  />
                  <div className="absolute top-4 left-4 bg-red-500 text-white px-4 py-2 rounded-full font-medium">
                    Before
                  </div>
                </div>
                <div className="relative">
                  <img
                    src={selectedImage.after}
                    alt="After transformation"
                    className="w-full h-96 md:h-full object-cover"
                  />
                  <div className="absolute top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-full font-medium">
                    After
                  </div>
                </div>
              </div>
              
              <div className="p-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">{selectedImage.title}</h2>
                <p className="text-lg text-gray-600 mb-6">{selectedImage.description}</p>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    to="/trynow"
                    className="flex-1 bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold text-center hover:bg-purple-700 transition-colors"
                  >
                    Try This Style
                  </Link>
                  <button
                    onClick={closeModal}
                    className="flex-1 border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready for Your Transformation?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-purple-100">
            Join thousands who have discovered their perfect hairstyle with our AI technology
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/trynow" 
              className="bg-white text-purple-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors"
            >
              Start Your Transformation
            </Link>
            <Link 
              to="/signup" 
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-purple-600 transition-all duration-200"
            >
              Create Account
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default Gallery
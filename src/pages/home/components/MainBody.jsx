import React from 'react'
import SphereGallery from '../../../components/SphereGallery'

const MainBody = () => {
  const features = [
    {
      icon: "🎯",
      title: "Virtual Try-On",
      description: "Try different hairstyles on your bald head using our advanced AI technology"
    },
    {
      icon: "📸",
      title: "Photo Upload",
      description: "Simply upload your photo and see how different hairstyles look on you"
    },
    {
      icon: "🎨",
      title: "Style Library",
      description: "Browse through hundreds of hairstyles from classic to modern trends"
    },
    {
      icon: "💾",
      title: "Save & Share",
      description: "Save your favorite looks and share them with friends and family"
    }
  ]

  const popularStyles = [
    { name: "Classic Buzz Cut", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face" },
    { name: "Modern Fade", image: "https://images.unsplash.com/photo-1566492031773-4f4e44671d66?w=200&h=200&fit=crop&crop=face" },
    { name: "Textured Crop", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face" },
    { name: "Slick Back", image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200&h=200&fit=crop&crop=face" }
  ]

  return (
    <main className="min-h-screen">
      {/* Interactive Sphere Gallery Hero */}
      <section className="relative">
        <SphereGallery />
        <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
          <div className="text-center bg-black/50 backdrop-blur-md rounded-3xl px-8 py-12 mx-4 max-w-4xl">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 drop-shadow-2xl">
              Try Before You
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400"> Style</span>
            </h1>
            <p className="text-xl text-gray-100 mb-8 max-w-2xl mx-auto drop-shadow-lg">
              Transform your look with our virtual hair try-on platform. 
              Explore different hairstyles in our interactive 3D gallery.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pointer-events-auto">
              <button className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 shadow-lg">
                Try Hair Now
              </button>
              <button className="border-2 border-white text-white bg-white/10 backdrop-blur-sm px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-purple-600 transition-all duration-200 shadow-lg">
                View Gallery
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose HeadZ?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our platform makes it easy to visualize your new look with confidence
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center p-6 rounded-lg hover:shadow-lg transition-shadow duration-200">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Styles Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Popular Styles</h2>
            <p className="text-xl text-gray-600">Discover trending hairstyles that look great on bald heads</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularStyles.map((style, index) => (
              <div key={index} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-200">
                <div className="h-48 bg-gray-200 flex items-center justify-center">
                  <div className="w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center">
                    <span className="text-2xl">👤</span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">{style.name}</h3>
                  <button className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors">
                    Try This Style
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-blue-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Transform Your Look?
          </h2>
          <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
            Join thousands of users who have found their perfect hairstyle with HeadZ
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-purple-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors">
              Start Free Trial
            </button>
            <button className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-purple-600 transition-all duration-200">
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">What Our Users Say</h2>
            <p className="text-xl text-gray-600">Real stories from people who transformed their look</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                  J
                </div>
                <div className="ml-4">
                  <h4 className="font-semibold">John D.</h4>
                  <p className="text-gray-600 text-sm">Software Engineer</p>
                </div>
              </div>
              <p className="text-gray-700">
                "HeadZ helped me find the perfect hairstyle. I was nervous about trying something new, but seeing it virtually first gave me confidence!"
              </p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                  M
                </div>
                <div className="ml-4">
                  <h4 className="font-semibold">Mike R.</h4>
                  <p className="text-gray-600 text-sm">Business Owner</p>
                </div>
              </div>
              <p className="text-gray-700">
                "The virtual try-on feature is incredible! I tried 20 different styles before choosing the perfect one for my face shape."
              </p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-white font-bold">
                  D
                </div>
                <div className="ml-4">
                  <h4 className="font-semibold">David L.</h4>
                  <p className="text-gray-600 text-sm">Teacher</p>
                </div>
              </div>
              <p className="text-gray-700">
                "Finally found a style that works for me! The before and after comparison was eye-opening and helped me make the right choice."
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

export default MainBody
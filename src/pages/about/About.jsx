import React from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../../components/common_components/navbar/Navbar'
import Footer from '../../components/common_components/footer/Footer'

const About = () => {
  const teamMembers = [
    {
      name: "Dr. Sarah Mitchell",
      role: "Founder & CEO",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300&h=300&fit=crop&crop=face",
      bio: "AI researcher with 15+ years in computer vision and beauty technology."
    },
    {
      name: "Marcus Rodriguez",
      role: "Head of AI Development",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face",
      bio: "Machine learning expert specializing in image processing and neural networks."
    },
    {
      name: "Emma Thompson",
      role: "UX Design Director",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face",
      bio: "Award-winning designer with expertise in user experience and interface design."
    }
  ]

  const achievements = [
    { number: "50K+", label: "Happy Users" },
    { number: "1M+", label: "Transformations" },
    { number: "99%", label: "Satisfaction Rate" },
    { number: "24/7", label: "Support Available" }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">
              About HeadZ
            </h1>
            <p className="text-xl leading-relaxed mb-8 text-purple-100">
              We're revolutionizing how people visualize and choose hairstyles using cutting-edge AI technology. 
              Our mission is to help everyone find their perfect look with confidence.
            </p>
            <Link 
              to="/trynow" 
              className="inline-block bg-white text-purple-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors shadow-lg"
            >
              Try Our Technology
            </Link>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Story</h2>
                <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                  HeadZ was born from a simple observation: choosing a new hairstyle is one of life's most 
                  anxiety-inducing decisions. What if you could see exactly how you'd look before making the cut?
                </p>
                <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                  Founded in 2023 by a team of AI researchers and beauty industry veterans, we set out to create 
                  the most accurate and easy-to-use virtual hairstyle platform in the world.
                </p>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Today, HeadZ has helped over 50,000 people find their perfect hairstyle, from bold new looks 
                  to subtle changes that boost confidence.
                </p>
              </div>
              <div className="relative">
                <img 
                  src="https://images.unsplash.com/photo-1521849243351-59b3b7fb0c78?w=600&h=400&fit=crop" 
                  alt="Hair salon" 
                  className="rounded-2xl shadow-xl"
                />
                <div className="absolute -bottom-4 -right-4 bg-purple-600 text-white p-6 rounded-xl shadow-lg">
                  <div className="text-3xl font-bold">2023</div>
                  <div className="text-sm">Founded</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Achievements */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">By the Numbers</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {achievements.map((achievement, index) => (
                <div key={index} className="text-center bg-white p-6 rounded-xl shadow-md">
                  <div className="text-4xl font-bold text-purple-600 mb-2">{achievement.number}</div>
                  <div className="text-gray-600 font-medium">{achievement.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                The brilliant minds behind HeadZ are passionate about combining technology with beauty
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {teamMembers.map((member, index) => (
                <div key={index} className="text-center bg-gray-50 p-8 rounded-2xl hover:shadow-lg transition-shadow">
                  <img 
                    src={member.image} 
                    alt={member.name}
                    className="w-32 h-32 rounded-full mx-auto mb-6 object-cover shadow-lg"
                  />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{member.name}</h3>
                  <p className="text-purple-600 font-semibold mb-4">{member.role}</p>
                  <p className="text-gray-600 leading-relaxed">{member.bio}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-gradient-to-r from-purple-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="bg-white p-8 rounded-2xl shadow-lg">
                <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mb-6">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h3>
                <p className="text-gray-600 leading-relaxed">
                  To democratize hairstyle visualization through AI technology, making it easy and accessible 
                  for everyone to experiment with their look before committing to a change.
                </p>
              </div>
              
              <div className="bg-white p-8 rounded-2xl shadow-lg">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-6">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h3>
                <p className="text-gray-600 leading-relaxed">
                  To become the world's most trusted platform for virtual hairstyle try-ons, helping millions 
                  of people discover their perfect look with confidence and creativity.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Transform Your Look?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-purple-100">
            Join thousands of users who have discovered their perfect hairstyle with HeadZ
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/trynow" 
              className="bg-white text-purple-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors"
            >
              Try Hair Now
            </Link>
            <Link 
              to="/contact" 
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-purple-600 transition-all duration-200"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default About
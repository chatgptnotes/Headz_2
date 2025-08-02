import React from 'react'
import Header from './components/Header'
import Navbar from '../../components/common_components/navbar/Navbar'
import MainBody from './components/MainBody'
import Footer from '../../components/common_components/footer/Footer'

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <Navbar />
      <MainBody />
      <Footer />
    </div>
  )
}

export default Home
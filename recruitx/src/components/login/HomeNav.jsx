import React from 'react'
import logo from '../../assets/logo.svg'
import { Link } from 'react-router-dom'

const HomeNav = () => {
  return (
    <div className="flex justify-between items-center px-4 h-16 bg-blue-950 font-[poppins]" role="navigation">
        <a href="/">
        <div className='w-[10rem]'><img src={logo}/></div>
        </a>
        <div className="flex justify-between items-center">
        </div>
        <div className="w-[10rem] flex justify-end">
          <Link to="register/candidate" className="text-white px-4 hover:text-blue-250">Register</Link>
          <Link to="login" className="text-white px-4 hover:text-blue-250">Login</Link>
        </div>
    </div>    
  )
}

export default HomeNav

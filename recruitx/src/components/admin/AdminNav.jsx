import React from 'react'
import logo from '../../assets/logo.svg'

const AdminNav = () => {
  return (
    <div className="flex justify-center items-center px-4 h-11 bg-blue-950 font-[poppins]" role="navigation">
          <a href="/hr">
        <img src={logo} className='w-[100px]'/>
          </a>
    </div>    
  )
}

export default AdminNav

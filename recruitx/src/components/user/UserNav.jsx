import React from 'react'
import logo from '../../assets/logo.svg'
import { Link, useNavigate } from 'react-router-dom'

const UserNav = ({udata}) => {
  const navigator=useNavigate()
  return (
    <div className="flex justify-between items-center px-4 h-16 bg-blue-950 font-[poppins]" role="navigation">
        <div className='w-[10rem]'>
          <a href="/candidate">
          <img src={logo}/>
          </a>
          </div>
        <div className="flex justify-between items-center">
            <Link to="" className="text-white px-4 hover:text-blue-250">Dashboard</Link>
            <Link to="applyjobs" className="text-white px-4 hover:text-blue-250">Jobs</Link>
            <Link to="appliedjobs" className="text-white px-4 hover:text-blue-250">Applied</Link>
            <Link to="profile" className="text-white px-4 hover:text-blue-250">Profile</Link>
        </div>
        <div className="w-[10rem] flex justify-end">
            {/* <span className='text-white'>{udata.name}</span> */}
            <div className='text-white cursor-pointer' onClick={()=>{navigator("/login"); sessionStorage.setItem("usertoken","")}}>Sign-Out</div>
        </div>
    </div>    
  )
}

export default UserNav

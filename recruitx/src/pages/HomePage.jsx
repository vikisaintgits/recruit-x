import React, { useState } from 'react'
import HomeNav from '../components/login/HomeNav'
import Login from '../components/login/Login'
import { Outlet } from 'react-router-dom';
const HomePage = () => {

    return (
    <div>
      <HomeNav/>
      <div className='flex justify-center items-center h-[90vh]'>
      <Outlet/>
      </div>
    </div>
  )
}

export default HomePage

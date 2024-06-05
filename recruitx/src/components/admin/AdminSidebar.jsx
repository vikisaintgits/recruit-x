import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
const AdminSidebar = ({company_name}) => {
  const navigator=useNavigate()
  return (
    <div className='flex flex-col w-[15rem] h-[91vh] py-10 bg-gray-200'>
      <div className='flex flex-col items-center'>
        <span className='mt-3 text-gray-800 font-[poppins] text-[20px] font-bold'>{company_name}</span>
      </div>
      <div className='flex flex-col items-center mt-5'>
        <Link to="" className='mt-5 bg-blue-950 text-white w-full text-center p-2' >Dashboard</Link>
        <Link to="createjob" className='mt-5 bg-blue-950 text-white w-full text-center p-2' >Create Job Posting</Link>
        <Link to="applications" className='mt-5 bg-blue-950 text-white w-full text-center p-2' >Applications</Link>
        <Link to="closedapplications" className='mt-5 bg-blue-950 text-white w-full text-center p-2' >Closed Applications</Link>
        <Link to="profile" className='mt-5 bg-blue-950 text-white w-full text-center p-2' >Profile</Link>
        <div className='mt-5 bg-blue-950 text-white w-full text-center p-2 cursor-pointer' onClick={()=>{navigator("/login"); sessionStorage.setItem("usertoken","")}}>Sign-Out</div>
      </div>
    </div>
  )
}

export default AdminSidebar

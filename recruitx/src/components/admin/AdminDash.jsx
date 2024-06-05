import React, { useEffect, useState } from 'react'
import DashCard from '../ui/DashCard'
import axios from 'axios'

const AdminDash = () => {
  const token = sessionStorage.getItem('usertoken')
  const [data, setData] = useState({})
  //send request to server to get stats
  const getdata = async () => {
    await axios
      .get('http://localhost:5000/getdashstats', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setData(res.data)
      })
      .catch((err) => {
        console.log(err)
      })
  }
  useEffect(() => {
    getdata()
  }
  , [])

  return (
    <div className='w-full flex flex-col p-10 '>
    <div className='text-[20px] font-bold font-[poppins] px-16 text-slate-800'>Hello HR 👋</div>
    <div className='w-full h-fit flex flex-row flex-wrap justify-center'>
            <DashCard text='Total Jobs Created' value={data.total_jobs} color='bg-blue-950'/>
            <DashCard text='Jobs Open' value={data.active_jobs} color='bg-green-800'/>
            <DashCard text='Total Applications Recieved' value={data.total_applications} color='bg-indigo-800'/>
            <DashCard text='Total Candidates Selected' value={data.shortlisted_applications} color='bg-rose-800'/>
        </div>
    </div>
  )
}

export default AdminDash

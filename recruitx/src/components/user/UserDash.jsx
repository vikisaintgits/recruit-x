import React, { useEffect, useState } from 'react'
import DashCard from '../ui/DashCard'
import axios from 'axios'

const UserDash = () => {
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
                console.log(res.data)
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
            <div className='w-full h-fit flex flex-row flex-wrap justify-center'>
                <DashCard text='Total Jobs Applied' value={data.total_jobs} color='bg-blue-950' />
                <DashCard text='Jobs Shortlisted' value={data.shortlisted_applications} color='bg-green-800' />
                <DashCard text='Applications Rejected' value={data.rejected_applications} color='bg-red-800' />
                <div class={`m-5 w-[250px] rounded-lg bg-indigo-800 p-2`}>
                    <span class="m-2 my-2 flex justify-start text-[15px] font-bold text-slate-300 flex-wrap">Last Application Status</span>
                    <div class="mx-10 flex justify-end text-[30px] font-bold text-white">{data.last_job}</div>
                </div>
            </div>
        </div>
    )
}

export default UserDash

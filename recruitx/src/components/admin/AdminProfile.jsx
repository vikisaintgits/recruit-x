import React, { useEffect, useState } from 'react'
import Button from '../ui/Button'
import axios from 'axios'
import {Link, useNavigate} from 'react-router-dom'


const AdminProfile = () => {
const [data,setData] = useState({})
const [newdata,setNewdata] = useState({})
const token=sessionStorage.getItem('usertoken')
//send request to server getuserdata route get methos with token in header
const getdata=async ()=>{
    await axios.get('http://localhost:5000/getuserdata',{
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    }).then((res)=>{
        setData(res.data.data[0])
        setNewdata(res.data.data[0])
    }).catch((err)=>{
        console.log(err)
    })}


    useEffect(()=>{
        getdata()
    },[])

const handlechange=(e)=>{
    setNewdata({...newdata,[e.target.name]:e.target.value})
    setData({...data,[e.target.name]:e.target.value})
}
const nav=useNavigate()
//send request to server updateuserdata route post method with token in header
const updatedata=async ()=>{
    //if newdata and data are same then no need to send request
    if(newdata==data){
        alert('No changes made')
        return
    }
    await axios.post('http://localhost:5000/updateuserprofiledata',{company_name:newdata.company_name,about:newdata.about},{
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    }).then((res)=>{
        alert('Profile Updated')
        window.location.reload()
    }
    ).catch((err)=>{
        console.log(err)
    })
}

  return (
    <div className='p-2 w-[650px] flex flex-col justify-center '>
            <div className='mt-5 flex items-center justify-between'>
                <label htmlFor="inp1">Company Name : </label>
                <input id='inp1' name='company_name' onChange={handlechange} className="border-2 text-sm border-blue-950 rounded-lg px-2 py-1 w-[400px]" type="text" value={data.company_name} />
            </div>
            <div className='mt-5 flex items-center justify-between'>
                <label htmlFor="inp4">About Company : </label>
                <textarea name='about' onChange={handlechange}  className='border-2 h-[100px] text-sm border-blue-950 rounded-lg px-2 py-2 w-[400px]' value={data.about}></textarea>
            </div>
            <div className='flex w-full justify-center mt-5'>
            <Link to='#' className='text-blue-900 underline'>Change Password ? Click here.</Link>
            </div>
            <div className='flex w-full justify-center mt-5'>
            <Button text="Update" onclickfn={updatedata}/>
            </div>
        </div>
  )
}

export default AdminProfile

import React, { useEffect, useState } from 'react'
import Button from '../ui/Button'
import axios from 'axios'
import {Link, useNavigate} from 'react-router-dom'

const UserProfile = () => {
    const [data,setData] = useState({})
    const [newdata,setNewdata] = useState({})
    const token=sessionStorage.getItem('usertoken')

    const getdata=async ()=>{
        await axios.get('http://localhost:5000/getuserdata',{
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        }).then((res)=>{
            setData(res.data.data[0])
            setNewdata(res.data.data[0])
            console.log(res.data.data[0])
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
        await axios.post('http://localhost:5000/updateuserprofiledata',{name:newdata.name,email:newdata.email,phone:newdata.phone,qualification:newdata.qualification},{
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
        <div className='w-full flex flex-col p-10 mt-10 items-center'>
            <div className='w-[550px] h-fit flex flex-col flex-wrap justify-center'>
                <div className='text-[20px] font-bold font-[poppins] text-slate-900 text-center'>User Profile</div>
                
                <div className='mt-5 flex items-center justify-between'>
                    <label htmlFor="inp1">Name : </label>
                    <input id='inp1' name='name' onChange={handlechange} className="border-2 text-sm border-blue-950 rounded-lg px-2 py-1 w-[400px]" type="text" value={data.name} />
                </div>
                <div className='mt-5 flex items-center justify-between'>
                    <label htmlFor="inp1">Email : </label>
                    <input id='inp1' name='email' onChange={handlechange} className="border-2 text-sm border-blue-950 rounded-lg px-2 py-1 w-[400px]" type="text" value={data.email} />
                </div>
                <div className='mt-5 flex items-center justify-between'>
                    <label htmlFor="inp2">Phone : </label>
                    <input id='inp2' name='phone' onChange={handlechange} className="border-2 text-sm border-blue-950 rounded-lg px-2 py-1 w-[400px]" type="text" value={data.phone} />
                </div>
                <div className='mt-5 flex items-center justify-between'>
                    <label htmlFor="inp3">Qualifications : </label>
                    <input id='inp3' name='qualification' onChange={handlechange} className="border-2 text-sm border-blue-950 rounded-lg px-2 py-1 w-[400px]" type="text" value={data.qualification} />
                </div>



                <div className='flex w-full justify-center mt-5'>
                <Link to='#' className='text-blue-900 underline'>Change Password ? Click here.</Link>
                </div>
                <div className='flex w-full justify-center mt-5'>
                <Button text="Update" onclickfn={updatedata}/>
                </div>
            </div>
        </div>
      )
    
}

export default UserProfile

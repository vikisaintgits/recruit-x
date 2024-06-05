import React, { useEffect, useState } from 'react'
import { Routes, Route,Outlet, useNavigate } from 'react-router-dom'
import AdminNav from '../components/admin/AdminNav'
import AdminSidebar from '../components/admin/AdminSidebar'

const AdminPage = () => {
    const navigator=useNavigate()
    useEffect(()=>{
        if(sessionStorage.getItem('usertoken')==""){
            navigator("/login")
        }
    },[])
    
    const token = sessionStorage.getItem('usertoken');
    const [user, setUser] = useState([]);
    useEffect(() => {
        fetch('http://localhost:5000/getuserdata', {
          method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
        })
          .then(res => res.json())
          .then(data => {
            setUser(data.data[0]);
          })
        .catch(err =>{navigator("/login")});
      }, []);

    return (
        <div>
            <AdminNav />
            <div className='flex'>
                <AdminSidebar company_name={user.company_name}/>
                <div className='flex border-2 w-full justify-center'>
                    <Outlet/>
                </div>
            </div>
        </div>
    )
}

export default AdminPage

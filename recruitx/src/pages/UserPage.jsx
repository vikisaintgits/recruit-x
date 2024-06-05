import React, { useEffect, useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom';
import UserNav from '../components/user/UserNav'

const UserPage = () => {
  const navigator=useNavigate()
    useEffect(()=>{
        if(sessionStorage.getItem('usertoken')==""){
            navigator("/login")
        }
    },[])

  const [user, setUser] = useState([]);
  const token = sessionStorage.getItem('usertoken');

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
            <UserNav udata={user}/>
            <div className="">
              
                <Outlet/>
            </div>
        </div>
    )
}

export default UserPage

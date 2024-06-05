import React, { useState } from 'react'
import Button from '../ui/Button'
import axios from 'axios'
const Login = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const onchange = (e) => {
        if(e.target.name === 'email'){
            setEmail(e.target.value)
        }else{
            setPassword(e.target.value)
        }
    }
    const loginaction = () => {
        axios.post('http://localhost:5000/login',{
            uemail: email,
            pass: password
        }).then((res)=>{
            // console.log(res.data.token)
            sessionStorage.setItem('usertoken',res.data.token)
            if(res.data.role==='candidate'){
                window.location.href = '/candidate'
            }
            else if(res.data.role==='hr'){
                window.location.href = '/hr'
            }
        }).catch((err)=>{
            console.log(err.response.data.error)
            if(err.response.data.error==='User not found'){
                alert('Invalid Credentials')
            }
            else{
            console.log(err)
            }
        })
    }

  return (
    <div className='flex flex-col gap-5 px-12 py-12 bg-slate-200 rounded-xl'>
        <h1 className='text-2xl font-bold font-[poppins]'>Login</h1>
      <input type="text" className='px-2 py-1 w-[300px]' name="email" id="t1" placeholder='email' onChange={onchange}/>
      <input type="password" className='px-2 py-1 w-[300px]' name="password" id="t2" placeholder='password' onChange={onchange}/>
    <Button text='Login' onclickfn={loginaction}/>
    </div>
  ) 
}

export default Login

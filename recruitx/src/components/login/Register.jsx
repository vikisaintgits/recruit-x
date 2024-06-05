import React from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import Button from '../ui/Button'
const Register = () => {
    const nav=useNavigate();
  return (
    <div>
        <div className='flex gap-5'>
            <Button text="Candidate" onclickfn={()=>nav("candidate")}/>
            <Button text="HR" onclickfn={()=>nav("hr")}/>
        </div>
      <Outlet/>
    </div>
  )
}

export default Register

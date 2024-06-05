import React, { useState } from 'react'
import Button from '../ui/Button'
import axios from 'axios'
const HRRegister = () => {

  const [formData, setFormData] = useState({
    company_name: '',
    email: '',
    password: '',
    company_description: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const sendToServer = () => {
    const validationErrors = {};

    if (!validateEmail(formData.email)) {
      validationErrors.email = 'Invalid email format';
    }

    if (Object.keys(validationErrors).length === 0) {
      axios.post('http://localhost:5000/register/hr', formData)
            .then((response) => {
              if(response.status === 200) {
                alert('Registered successfully');
                window.location.href = '/login';
              }
            })
            .catch((error) => {
              if(error.response.data.error=="UNIQUE constraint failed: user.email") {
                alert('Email already exists');
              }
              else {
                console.error(error);
              }
            });
        }
        else  {
          alert(Object.values(validationErrors).join('\n'));
        }
  };

  return (
    <div className='flex flex-col items-center gap-5 px-12 py-12 bg-slate-200 rounded-xl mt-10'>
        <h1 className='text-2xl font-bold font-[poppins]'>Register</h1>
      <input type="text" className='px-2 py-1 w-[300px]' name="company_name" id="t1" placeholder='company name' onChange={handleInputChange}/>
      <input type="text" className='px-2 py-1 w-[300px]' name="email" id="t1" placeholder='email' onChange={handleInputChange}/>
      <input type="password" className='px-2 py-1 w-[300px]' name="password" id="t2" placeholder='password' onChange={handleInputChange}/>
      <textarea type="text" className='px-2 py-1 w-[300px] h-[100px]' name="company_description" id="t1" placeholder='company description' onChange={handleInputChange}/>

    <Button text='Register' onclickfn={sendToServer}/>
    </div>
  )
}

export default HRRegister

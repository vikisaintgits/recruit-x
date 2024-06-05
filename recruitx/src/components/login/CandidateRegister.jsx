import React, { useState } from 'react'
import Button from '../ui/Button'
import axios from 'axios'
const CandidateRegister = () => {
    const [formData, setFormData] = useState({
      name: '',
      email: '',
      password: '',
      phone: '',
      qualification: '',
      experience: '',
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
  
    const validatePhoneNumber = (phone) => {
      const phoneRegex = /^\d{10}$/;
      return phoneRegex.test(phone);
    };

    const sendtoServer = () => {
        const validationErrors = {};

        if (!validateEmail(formData.email)) {
          validationErrors.email = 'Invalid email format';
        }

        if (formData.password.length < 8) {
          validationErrors.password = 'Password must be at least 8 characters long';
        }

        if (!validatePhoneNumber(formData.phone)) {
          validationErrors.phone = 'Invalid phone number (must be 10 digits)';
        }

        if (Object.keys(validationErrors).length === 0) {
          // No validation errors, proceed with the request
          axios.post('http://localhost:5000/register/candidate', formData)
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
                console.log(error);
              }
            });
        }
        else  {
          alert(Object.values(validationErrors).join('\n'));
        }
    }

  return (
    <div className='flex flex-col items-center gap-5 px-12 py-12 bg-slate-200 rounded-xl mt-10'>
        <h1 className='text-2xl font-bold font-[poppins]'>Register</h1>
      <input type="text" className='px-2 py-1 w-[300px]' name="name" id="t1" placeholder='name' onChange={handleInputChange}/>
      <input type="text" className='px-2 py-1 w-[300px]' name="email" id="t1" placeholder='email' onChange={handleInputChange}/>
      <input type="password" className='px-2 py-1 w-[300px]' name="password" id="t2" placeholder='password' onChange={handleInputChange}/>
      <input type="text" className='px-2 py-1 w-[300px]' name="phone" id="t2" placeholder='phone' onChange={handleInputChange}/>
      <input type="text" className='px-2 py-1 w-[300px]' name="qualification" id="t2" placeholder='qualification' onChange={handleInputChange}/>
    <Button text='Register' onclickfn={sendtoServer}/>
    </div>
  )
}

export default CandidateRegister

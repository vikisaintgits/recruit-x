import React, { useState } from 'react'
import Button from '../ui/Button'
import axios from 'axios'

const CreateJob = () => {
    const [formData, setFormData] = useState({
        jtitle: '',
        loc: '',
        qual_req: '',
        exp_req: '',
        jdesc: ''
    })

    const onInpChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const onCreateJob = () => {
        if (
            formData.jtitle === '' ||
            formData.loc === '' ||
            formData.qual_req === '' ||
            formData.exp_req === '' ||
            formData.jdesc === ''
        ) {
            alert('Please fill all the fields');
            return;
        }

        const token = sessionStorage.getItem('usertoken');
        console.log(token);
        axios
            .post('http://localhost:5000/postjob', formData, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((res) => {
                alert('Job Created');
                window.location.reload()
            })
            .catch((err) => {
                console.log(err.response.data);
            });
    };

    
    return ( 
        <div className='p-2 w-[650px] flex flex-col justify-center '>
            <div className='mt-5 flex items-center justify-between'>
                <label htmlFor="inp1">Job Title : </label>
                <input id='inp1' name='jtitle' onChange={onInpChange} className="border-2 text-sm border-blue-950 rounded-lg px-2 py-1 w-[400px]" type="text" />
            </div>
            <div className='mt-5 flex items-center justify-between'>
                <label htmlFor="inp1">Location : </label>
                <input id='inp2' name='loc' onChange={onInpChange} className="border-2 text-sm border-blue-950 rounded-lg px-2 py-1 w-[400px]" type="text" />
            </div>
            <div className='mt-5 flex items-center justify-between'>
                <label htmlFor="inp1">Qualification Required : </label>
                <input id='inp3' onChange={onInpChange} name='qual_req' className="border-2 text-sm border-blue-950 rounded-lg px-2 py-1 w-[400px]" type="text" />
            </div>
            <div className='mt-5 flex items-center justify-between'>
                <label htmlFor="inp1">Experience Required : </label>
                <input id='inp3' onChange={onInpChange} name='exp_req' className="border-2 text-sm border-blue-950 rounded-lg px-2 py-1 w-[400px]" type="text" />
            </div>
            <div className='mt-5 flex items-center justify-between'>
                <label htmlFor="inp4">Job Descriptions : </label>
                <textarea name='jdesc' onChange={onInpChange} className='border-2 h-[100px] text-sm border-blue-950 rounded-lg px-2 py-2 w-[400px]'></textarea>
            </div>
            <div className='flex w-full justify-center mt-5'>
            <Button text="Create Job Posting" onclickfn={onCreateJob}/>
            </div>
        </div>
    )
}

export default CreateJob

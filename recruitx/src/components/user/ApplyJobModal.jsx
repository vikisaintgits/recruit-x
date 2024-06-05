import React, { useEffect, useState } from 'react'
import Button from '../ui/Button';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
const ApplyJobModal = ({ ModalData, onclose }) => {
    const navigator = useNavigate()
    const token = sessionStorage.getItem('usertoken');
    const [user, setUser] = useState(null);
    const [file, setFile] = useState(null);
    const [formData, setFormData] = useState({});
    const [skills, setSkills] = useState("");
    const [loading, setLoading] = useState(false);
    const handleFileSelect = async (event) => {
        // console.log(event.target.files[0]);
        setLoading(true);
        await axios.post('http://localhost:5000/getuserresumedata', {
            resume: event.target.files[0]
        }, {
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${token}`,
            },
        })
            .then(response => {
                setUser(response.data.data[0]);
                setSkills(response.data.skills);
                setLoading(false);
            })
            .catch(error => {
                console.error(error);
            });

        setFile(event.target.files[0]);
    }
    //onchange for inputs in form to update formdata
    const handleiChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    //send data to backend
    const sendFile = async() => {
        setLoading(true);
        const formdata = new FormData();
        formdata.append('fdata', JSON.stringify(formData));
        formdata.append('jobid', ModalData.job_id);
        formdata.append('jobdesc', ModalData.job_description);
        formdata.append('resume', file);
        await fetch('http://localhost:5000/applyjob', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: formdata
        })
            .then(res => res.json())
            .then(data => {
                if (data.message === "Job posted successfully") {
                    alert("Applied Successfully!");
                    setLoading(false);
                    navigator("/candidate/appliedjobs");
                }
            })
    }



    return (
        <div className='bg-slate-600 p-12 text-white text-sm rounded-lg flex flex-col gap-2 absolute right-[250px] z-10 font-[poppins] w-[1000px]'>
            <div className={loading?"":"hidden"}>Processing Request! Please Wait.....</div>
            <div className={loading?"hidden":""}>
            <div className='flex w-full justify-end mb-3'><button className='bg-white text-red-600 font-bold px-2 py-1 rounded-full' onClick={onclose}>Close</button></div>
            <div className='flex justify-between mb-2'>
                <div className='flex gap-2'><span className='w-[200px]'>JobId: </span><span>{ModalData.job_id}</span></div>
                <div className='flex gap-2'><span className=''>Posted on: </span><span>{ModalData.post_date}</span></div>
            </div>

            <div className='flex gap-2'><span className='w-[200px]'>Company : </span><span>{ModalData.company_name}</span></div>
            <div className='flex gap-2'><span className='w-[200px]'>About Company : </span><span>{ModalData.about}</span></div>

            <div className='flex gap-2'><span className='w-[200px]'>Job Title : </span><span>{ModalData.job_title}</span></div>
            <div className='flex gap-2 flex-col'><span className='w-[200px]'>Job Description : </span><span>{ModalData.job_description}</span></div>
            <div className='flex gap-2'><span className='w-[200px]'>Job Location : </span><span>{ModalData.loc}</span></div>
            <div className='flex gap-2'><span className='w-[200px]'>Qualifications Required : </span><span>{ModalData.qualifications_required}</span></div>
            <div className='flex gap-2'><span className='w-[200px]'>Experience Required : </span><span>{ModalData.experience_required} Years</span></div>
            <div className='flex justify-center mt-5 text-lg font-bold'>Candidate Details</div>
            <div className=' ml-2 mt-3 font-bold text-slate-300'>Upload Resume :</div>
            <input className='rounded-full border-2 w-[400px]' accept='.pdf' type="file" onChange={handleFileSelect} />
            {file ? (
                <div className='mx-2 mt-2'>
                    <div className='flex gap-1 mt-1'><span className='w-[200px]'>Name: </span><span><input className='bg-transparent border-2 rounded-full px-3' type="text" value={user.name} /></span></div>
                    <div className='flex gap-1 mt-1'><span className='w-[200px]'>Email: </span><span><input className='bg-transparent border-2 rounded-full px-3' type="text" value={user.email} /></span></div>
                    <div className='flex gap-1 mt-1'><span className='w-[200px]'>Phone: </span><span><input className='bg-transparent border-2 rounded-full px-3' type="text" value={user.phone} /></span></div>
                    <div className='flex gap-1 mt-3'><span className='w-[200px]'>Skills: </span><span><textarea onChange={handleiChange} name='skills' className='bg-transparent border-2 rounded-lg px-3 h-[200px] w-[400px] resize-none overflow-y-scroll' type="text">{skills}</textarea></span></div>
                    <div className='flex gap-1 mt-3'><span className='w-[200px]'>Experience: </span><span><input onChange={handleiChange} name="experience" className='bg-transparent border-2 rounded-full px-3' type="text" /></span></div>
                </div>
            )
                : null}

            <div className='w-full flex justify-center mt-2'><Button text="Apply Now" onclickfn={file ? () => { sendFile() } : () => { alert("Upload Resume!") }} /></div>
            </div>
        </div>
    )
}

export default ApplyJobModal

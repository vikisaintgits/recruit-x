import React, { useEffect, useState } from 'react'
import AdminJobCards from '../ui/AdminJobCards'
const Applications = () => {
    const [jobs, setJobs] = useState([]);
    const [appCount, setAppCount] = useState({});
    const token = sessionStorage.getItem('usertoken');
    
    useEffect(() => {
        fetch('http://localhost:5000/getactivepostings', {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        })
        .then(res => res.json())
        .then(data => {
            if(!data.error){
                setJobs(data.data)
                setAppCount(data.count)
            }
        })
        .catch(err => console.log(err));
    }, []);

    return (
        <div className='w-full flex flex-col items-center mt-8'>
                <div className='mb-4 text-[30px] font-bold font-[poppins]'>Active Postings</div>
                {(jobs.length == 0)?(<div className='text-[15px] text-red-600'>No Active Posts Available</div>):null}
                {jobs.map((job, index) => (
                    <AdminJobCards key ={index} jid={job.job_id} title={job.job_title} pdate={job.post_date} loc={job.loc} totalapp={appCount[job.job_id]} />
                ))}
        </div>
    )
}

export default Applications

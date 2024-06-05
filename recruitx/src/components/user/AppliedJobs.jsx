import React, { useEffect, useState } from 'react'
import axios from 'axios';
import UserAppliedJobCards from '../ui/UserAppliedJobCards'
const ApplyJobs = () => {
const token = sessionStorage.getItem('usertoken');
const [jobs,SetJobs]=useState([]);

useEffect(()=>{
  axios.post('http://localhost:5000/getuserappliedjobs',{},{
    headers: {
      contentType: 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })
  .then(response => {
    console.log(response.data.data);
    SetJobs(response.data.data);
  })
  .catch(error => {
    console.error(error);
  });
},[])


  return (
    <>
    <div className='mt-10 flex flex-col items-center'>
    {(jobs.length == 0)?(<div className='text-[15px] text-red-600'>You have not applied for any Jobs.</div>):null}
      {
        jobs.map((job)=>{
          return(
        <UserAppliedJobCards title={job.job_title} adate={job.date} loc={job.loc} company={job.company_name} jdesc={job.job_description} status={job.status? job.status :"pending"} />
          )
        })
      }
    </div>
    </>
  )
}

export default ApplyJobs

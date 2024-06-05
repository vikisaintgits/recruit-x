import React, { useEffect, useState } from 'react'
import axios from 'axios';
import UserJobCards from '../ui/UserJobCards'
import ApplyJobModal from './ApplyJobModal';
const ApplyJobs = () => {
const token = sessionStorage.getItem('usertoken');
const [jobs,SetJobs]=useState([]);
const [ModalData,SetModalData]=useState(false);

useEffect(()=>{
  axios.post('http://localhost:5000/getuserjobs',{},{
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
    {
        ModalData? <ApplyJobModal ModalData={ModalData} onclose={()=>{SetModalData(false)}}/> : null
    }
    <div className={ModalData?'mt-5 flex flex-col items-center opacity-20':'mt-5 flex flex-col items-center'}>
    {(jobs.length == 0)?(<div className='text-[15px] text-red-600'>No Jobs Available</div>):null}
      {
        jobs.map((job)=>{
          return(
        <UserJobCards title={job.job_title} pdate={job.post_date} loc={job.loc} company={job.company_name} jdesc={job.job_description} applybtn={()=>{SetModalData(job)}}/>
          )
        })
      }
    </div>
    </>
  )
}

export default ApplyJobs

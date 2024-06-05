import React, { useEffect, useState } from 'react'
import Button from '../ui/Button'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import SelectedApplicantCards from './SelectedApplicantCards'

const ViewSelectedApplicants = () => {
    const { jid } = useParams();
    const token = sessionStorage.getItem('usertoken')
    const [data, setData] = useState([])

    //fetch the data from the backend posting the jobid
    async function fetchData() {
        try {
          const response = await axios.post(
            'http://localhost:5000/getselectedjobapplicants',
            {
              jobid: jid,
            },
            {
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
              },
            }
          );
            setData(response.data.data);
            console.log(response.data.data);
        } catch (error) {
          console.error(error);
        }
      }

    useEffect(() => {
        fetchData();
      }, []);
    

    return (
      <>
        <div className='w-full flex flex-col items-center mt-8'>
                <div className='text-[30px] font-bold font-[poppins]'>Selected Candidates</div>
            <div className='flex flex-col items-center mt-2'>
                {data.map((item) => {
                    return <SelectedApplicantCards name={item.name} skills={item.skills} qual={item.qualification} exp={item.experience} resume={item.resume} uid={item.user_id}/>
                })}
            </div>

        </div>
    </>
    )
}

export default ViewSelectedApplicants

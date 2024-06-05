import React from 'react'
import Button from './Button'
import { useNavigate } from 'react-router-dom'
const AdminJobCards = ({ jid,title, pdate, loc, totalapp}) => {
    const navigate=useNavigate();
    return (
        <div className="flex w-2/3 justify-between items-center bg-gray-200 py-5 px-10 rounded-lg mb-5">
            <div className=''>
                <div className='font-bold text-xl mb-2'>{title}</div>
                <div className='text-[13px] mb-2'><span className='text-gray-600'>Posted On: </span><span className='font-bold'>{pdate}</span></div>
                <div className='text-gray-900'>{loc}</div>
            </div>
            <div className='flex flex-col items-center'>
                <div><span>Total Applications: </span><span className='font-bold'>{totalapp}</span></div>
                <div className=""><Button width="200px" text="View Applicants" onclickfn={() => {
                    sessionStorage.setItem('selectedjobid', jid);
                    navigate(`${jid}`);
                }} /></div>
            </div>
        </div>
    )
}

export default AdminJobCards

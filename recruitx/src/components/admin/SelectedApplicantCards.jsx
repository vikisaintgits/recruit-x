import React from 'react'
import Button from '../ui/Button'

const SelectedApplicantCards = ({name,skills,qual,exp,resume,uid}) => {
    const redirectUrl = `http://localhost:5000/getresume/${resume}`;
    return (
        <div className='bg-gray-300 w-[1000px] p-5 rounded-xl mt-4'>
            <div className="flex justify-between items-center">
                <div className="flex flex-col">
                    <div className='font-bold text-xl'>{name}</div>
                    <div className='font-bold text-slate-600 text-sm'>{qual}</div>
                    <div className='flex items-end gap-5 font-[poppins] mt-2'>
                        <div>
                            <div className='flex gap-2'><span className='font-bold mr-11'>Skills: </span><span className='font-mono'>{skills}</span></div>
                            <div className='flex gap-2 mt-2'><span className='font-bold'>Experience: </span><span>{exp}</span></div>
                        </div>
                    </div>
                </div>
                <div className='flex flex-col w-[200px] ml-3'>
                    <Button width="200px" text="View Resume" onclickfn={()=>{window.open(redirectUrl, '_blank')}}/>
                </div>
            </div>
        </div>
    )
}

export default SelectedApplicantCards

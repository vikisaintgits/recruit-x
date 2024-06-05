import React from 'react'
import Button from './Button'
const UserJobCards = ({ title, pdate, loc, company,jdesc,applybtn }) => {
    return (
        <div className="flex w-2/3 flex-col bg-gray-200 py-5 px-10 rounded-lg mb-5">
            <div className='flex justify-between'>
                <div>
                    <div className='font-bold text-xl mb-2'>{title}</div>
                    <div className='text-gray-900 font-bold'>{company}</div>
                    <div className='text-gray-900'>{loc}</div>
                </div>
                <div className='flex flex-col items-center'>
                    <Button text='Apply' width='200px' onclickfn={applybtn}/>
                    <div className='text-[13px] my-2'><span className='text-gray-600'>Posted On: </span><span className='font-bold'>{pdate}</span></div>

                </div>
            </div>
            <div className='flex font-[poppins] text-justify'>
                {jdesc}
            </div>
        </div>
    )
}

export default UserJobCards

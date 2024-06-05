import React from 'react'
const UserJobCards = ({ title, adate, loc, company,jdesc,status }) => {
    return (
        <div className="flex w-2/3 flex-col bg-gray-200 py-5 px-10 rounded-lg mb-5">
            <div className='flex justify-between'>
                <div>
                    <div className='font-bold text-xl mb-2'>{title}</div>
                    <div className='text-gray-900 font-bold'>{company}</div>
                    <div className='text-gray-900'>{loc}</div>
                </div>
                <div className='flex flex-col items-center'>
                <div className={`mt-3 ${status=="pending"?"bg-gray-900":status=="shortlisted"?"bg-green-900":"bg-red-700"} rounded-full text-white w-[200px] text-center p-2 `}>{status}</div>
                    <div className='text-[13px] my-2'><span className='text-gray-600'>Applied On: </span><span className='font-bold'>{adate}</span></div>

                </div>
            </div>
            <div className='flex font-[poppins] text-justify'>
                {jdesc}
            </div>
        </div>
    )
}

export default UserJobCards

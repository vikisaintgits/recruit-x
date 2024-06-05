import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const SelectionFinaliseModal = ({ data, jid, uid_list, onclose }) => {
  const token = sessionStorage.getItem('usertoken')
  const [loading, setLoading] = useState(false)
  const navigator = useNavigate()
  const sendEmail = async () => {
    setLoading(true)
    await axios.post('http://localhost:5000/sendemailselected', {
      jid: jid,
      uid_list: uid_list,
      emailcontent: emailcontent,
    }, {
      headers: {
        contentType: 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
      .then(response => {
        if (response.status == 200) {
          onclose()
          setLoading(false)
          navigator("/hr/closedapplications")
        }
      }
      )
      .catch(error => {
        console.error(error);
      });

  }
  const [emailcontent, setEmailcontent] = useState("")
  const handleEmailChange = (e) => {
    setEmailcontent(e.target.value)
  }
  const finaldata = data.filter((item) => uid_list.includes(item.user_id))
  return (

    <div>
      <div className='bg-slate-600 p-12 text-white text-sm rounded-lg flex flex-col gap-2 absolute mt-5 right-[170px] z-10 font-[poppins] w-[1000px]'>
      
        <div className='flex w-full justify-end mb-3'><button className='bg-white text-red-600 font-bold px-2 py-1 rounded-full' onClick={onclose}>Close</button></div>
        
        <div className='flex flex-col gap-2'>
          <div className='font-bold text-xl'>Finalised Candidates</div>
          <div className='flex flex-row gap-5 flex-wrap'>
            {finaldata.map((item) => {
              return <li className=''>{item.name + `(${item.qualification})`}</li>
            })}
          </div>
        </div>
        <div className='font-bold text-xl mt-5'>Email Content</div>
        <textarea className='bg-white rounded-lg p-5 h-[200px] text-black' placeholder='Enter Email Content Here' onChange={handleEmailChange}></textarea>
        <div className={loading?"":"hidden"}>Processing Request! Please Wait.....</div>
        <div className={loading?"hidden":'flex justify-center mt-5'}><button className='bg-green-900 text-white rounded-full px-5 py-2' onClick={sendEmail}>Send Email</button></div>
        </div>
    </div>
  )
}

export default SelectionFinaliseModal

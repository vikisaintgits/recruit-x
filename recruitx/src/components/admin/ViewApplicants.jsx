import React, { useEffect, useState } from 'react'
import SearchBar from '../ui/SearchBar'
import ApplicantCards from './ApplicantCards'
import Button from '../ui/Button'
import { useParams } from 'react-router-dom'
import axios from 'axios'


import SelectionFinaliseModal from './SelectionFinaliseModal'
const ViewApplicants = () => {

    const { jid } = useParams();
    const token = sessionStorage.getItem('usertoken')
    const [data, setData] = useState([])

    //fetch the data from the backend posting the jobid
    async function fetchData() {
        try {
          const response = await axios.post(
            'http://localhost:5000/getjobapplicants',
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
    
    const [selected, setSelected] = useState([])
    const [final, setFinal] = useState(false)
    const selectcads = (uid) => {
      if(selected.includes(uid)){
        setSelected(selected.filter((item)=>item!=uid))
        return
      }
        setSelected([...selected, uid])
    }
    const finalise = () => {
      if(selected.length===0){
        alert("Please select atleast one candidate")
        return
      }
      setFinal(true)
    }
    const clearall = () => {
      setSelected([])
    }
    const onModalClose = () => {
      setFinal(false)
    }

    return (
      <>
        {final? <SelectionFinaliseModal data={data} jid={jid} uid_list={selected} onclose={onModalClose}/>: null}
        <div className={final?"w-full opacity-20":"w-full"}>
            <SearchBar />
            <div className='flex justify-center gap-12 mt-2'>
                <Button width='300px' text="Finalise Selection" onclickfn={finalise} />
                <Button text="Clear All" onclickfn={clearall}/>
            </div>
            <div className='flex flex-col items-center mt-5'>
                {data.map((item) => {
                    return <ApplicantCards name={item.name} skills={item.skills} qual={item.qualification} exp={item.experience} resume={item.resume} uid={item.user_id} selected={selected} selectfn={selectcads}/>
                })}
            </div>

        </div>
    </>
    )
}

export default ViewApplicants

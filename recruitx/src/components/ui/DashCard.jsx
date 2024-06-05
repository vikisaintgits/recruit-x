import React from 'react'

const DashCard = ({text,value,color}) => {
    return (
        <div class={`m-5 w-[250px] rounded-lg ${color} p-2`}>
            <span class="m-2 my-2 flex justify-start text-[15px] font-bold text-slate-300 flex-wrap">{text}</span>
            <div class="mx-10 flex justify-end text-[40px] font-bold text-white">{value}</div>
        </div>
    )
}

export default DashCard

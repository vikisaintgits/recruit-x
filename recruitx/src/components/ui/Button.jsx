import React from 'react'

const Button = ({width="300px",text,onclickfn=()=>{}}) => {
  return (
    <>
        <button className={`mt-3 bg-blue-950 rounded-full text-white w-[${width}] text-center p-2 `} href="" onClick={onclickfn}>{text}</button>
    </>
  )
}

export default Button

import React from 'react'
import Button from './Button'
const SearchBar = () => {
  return (
    <div className='flex justify-center items-center mt-5'>
      <input type="text" className='border-2 h-8 w-1/2 px-2' placeholder='type what you are looking for...!'/><button className='border-2 py-1 px-3 bg-blue-950 text-white rounded-lg ml-4'>Search</button>
    </div>
  )
}

export default SearchBar

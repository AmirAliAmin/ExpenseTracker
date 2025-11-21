import React, { useState } from 'react'
import {FaRegEye, FaRegEyeSlash} from 'react-icons/fa6'

export default function Input({type,value,onChange,label,placeholder,name}) {
    const [showPass, setShowPass] = useState(false)
  return (
    <div>
      <label htmlFor={name}  className='text-[13px] text-slate-800 '>{label}</label>
      <div className='input-box'>
        <input 
        type={type === "password" ? showPass ? "text" : "password" : type} 
        placeholder={placeholder} 
        name={name} 
        value={value} 
        onChange={(e)=> onChange(e)}
        className='w-full bg-transparent outline-none '
        />

        {type === "password" && (
            <>
            {
                showPass?(
                    <FaRegEyeSlash size={22} className='text-primary cursor-pointer' onClick={()=>setShowPass(!showPass)} />
                ):(
                    <FaRegEye size={22} className='text-slate-400 cursor-pointer' onClick={()=>setShowPass(!showPass)} />
                )
            }
            </>
        )}
      </div>
    </div>
  )
}

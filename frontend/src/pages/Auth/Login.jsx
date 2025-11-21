import React, { useState } from 'react'
import AuthLayout from '../../components/layouts/AuthLayout'
import { Link, useNavigate } from 'react-router-dom';
import Input from '../../components/Inputs/Input';
import { validateEmail } from '../../utils/helper';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATH } from '../../utils/apiPath';
import { useContext } from 'react';
import { UserContext } from '../../context/userContext';

function Login() {
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [error, setError] = useState(null);

  const {updateUser} = useContext(UserContext)

  const navigate = useNavigate();

  const handleLogin = async(e)=>{
    e.preventDefault();

    if (!email) {
    setError("Please enter your email")
      return;
   }
    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!password) {
      setError("Please enter password");
      return;
    }
    

    setError("");

    //login API Call
    try {
      const response = await axiosInstance.post(API_PATH.AUTH.LOGIN, {
        email,
        password
      });
      const {token, user} = response.data;
      if (token) {
        localStorage.setItem("token", token);
        updateUser(user)
        navigate("/dashboard")
      }
    } catch (error) {
      if (error.response && error.response.data.message) {
        setError(error.response.data.message)
      }else{
        setError("SomeThing went Wrong. Please try again")
      }
    }
  }

  return (
    <AuthLayout>
      <div className='lg:w-[70%] h-3/4 md:h-full flex flex-col justify-center'>
        <h3 className='text-xl font-semibold text-black'>Welcome Back</h3>
        <p className='text-xs text-slate-700 mt-[5px] mb-6'>Please enter your details to log in</p>

        <form onSubmit={handleLogin}>
          <Input 
          type="text" 
          value={email}  
          onChange={({target})=>setEmail(target.value)} 
          label="Email Address" 
          placeholder='jhon@email.com'
          name="email"
          />

          <Input 
          type="password" 
          value={password}  
          onChange={({target})=>setPassword(target.value)} 
          label="Password" 
          placeholder='Min 8 Characters'
          name="password"
          />

          {error && <p className='text-red-500 text-xs pb-2.5'>{error}</p>}
          <button className='uppercase btn-primary'>Login</button>

          <p className='text-[13px] text-slate-800 mt-3'>Don't have an account? {" "}
            <Link className='font-medium text-primary underline' to={'/signup'}>Signup</Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  )
}

export default Login
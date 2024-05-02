import React, { useState } from 'react'
import { Context } from '../main.jsx'
import { toast } from 'react-toastify';
import { useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import logo from '../Photos/logo.png'

const login = () => {
  const {isAuthenticated,setIsAuthenticated} = useContext(Context);
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const [confirmPassword,setConfirmPassword]=useState("");
  
  const navigateTo = useNavigate();

  const handleLogin = async (e)=>{
    e.preventDefault();
    try{
      const response =await axios.post ("https://hospmang-backend.onrender.com/api/v1/user/patient/login",{email,password,confirmPassword,role:"Admin"},
    {withCredentials:true,
    headers:{"Content-Type":"application/json"},
  });
  toast.success(response.data.message);
  setIsAuthenticated(true);
  navigateTo("/");
}
  catch(error){
    toast.error(error.response.data.message);
  }
    
} 
  
  return (
    <>
      <div className='container form-component'>
      <img src={logo} alt="" className='logo'/>
      <h1 className='form-title'>WELCOME TO ZEECARE</h1>
      <p>Only Admins are allow to access these resources</p>
      <form onSubmit={handleLogin}>
        <input type="text" placeholder='email' value={email} onChange={(e)=>{setEmail(e.target.value)}}/>
        <input type="text" placeholder='password' value={password} onChange={(e)=>{setPassword(e.target.value)}}/>
        <input type="text" placeholder='email' value={confirmPassword} onChange={(e)=>{setConfirmPassword(e.target.value)}}/>
        
       <div style={{justifyContent:"center", alignItems:"center"}}>
            <button type='submit'>Login</button>
       </div>
      </form>
    </div>
    </>
  )
}

export default login

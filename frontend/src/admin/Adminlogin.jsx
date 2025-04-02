import React, { useState } from 'react'
import reactLogo from '../assets/react.svg'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios';
import toast from 'react-hot-toast'

function Adminlogin() {
  const navigate = useNavigate();

  const[email,setEmail] = useState("");
  const[password,setPassword] = useState("");
  const[error,setError] = useState("");

  async function handleSubmit(e){
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:4001/api/v1/admin/login",{
        email,
        password
      },{
        withCredentials : true,
        headers : {
          "Content-Type" : "application/json"
        }
      })
      console.log(response);
      if(response.data == "No user found" || response.data == "password is incorrect"){
        setError(response.data);
      }else{
        toast.success("login successfull");
        localStorage.setItem("admin", JSON.stringify(response.data));
        navigate('/admindashboard');
      }
      console.log("server response :",response.data);
    } catch (error) {
      setError(error.response.data.msg);
      console.log("error :",error)
    }
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-t from-black to-blue-950">
        <div className='items-center h-screen text-white mx-auto pl-10 pr-10'>
            {/* header component */}
            <header className='flex items-center justify-between p-6'>
                <div className='flex items-center space-x-2'>
                    <img src={reactLogo} alt="" className='h-10 w-10 rounded-full'></img>
                    <h1 className='text-2xl text-orange-500 font-bold'>C0urs0</h1>
                </div>
                <div className='fles items-center space-x-3'>
                    {/*<Link to={"/login"} className=' bg-transparent px-2 py-2 border border-white rounded'>Log In</Link>*/}
                    <Link to={"/adminsignup"} className=' bg-transpsarent px-2 py-2 border border-white rounded'>Sign Up</Link>
                </div>
            </header>
            <div className='bg-gray-900 px-10 py-5 rounded-lg shadow-lg m-10 w-[400px] mx-auto'>
              <h2 className='text-center text-2xl text-orange-500'>C0urs0</h2>
              <p className='text-center text-sm text-gray-400'>Welcome Maalik</p>
              <form onSubmit={handleSubmit}>
                <div className="flex flex-col my-4">
                  
                  <label htmlFor="email" className="text-gray-400 text-sm mt-2">E-mail</label>
                  <input 
                    id="email"
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-10 bg-gray-800 p-3 rounded-md"
                    placeholder='email'
                  />
                  <label htmlFor="password" className="text-gray-400 text-sm mt-2">Password</label>
                  <input 
                    id="password"
                    type="text"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full h-10 bg-gray-800 p-3 rounded-md"
                    placeholder='password'
                  />
                  {error && (
                    <div className='text-sm text-red-400'>{error}</div>
                  )}
                  <button type='submit' className='bg-orange-500 text-semi-bold py-2 mt-2 border rounded-md hover:bg-green-500 duraion-300 cursor-pointer'>submit</button>
                  
                  
                </div>
              </form>
            </div>

            
        </div>
    </div>
  )
}

export default Adminlogin
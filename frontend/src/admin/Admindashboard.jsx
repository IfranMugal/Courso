import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'


function Admindashboard() {
    const[isLogin,setIsLogin] = useState(false)
    const navigate = useNavigate()

    const admin = localStorage.getItem("admin")
    useEffect(()=>{
        if(!admin){
            navigate("/adminlogin")
            toast.error("login to view dashboard")
            return
        }else{
            setIsLogin(true)
        }
    },[])

    async function handleLogout(){
        try {
            const response = await axios.post('http://localhost:4001/api/v1/admin/logout',{},{
                withCredentials: true
            })
            localStorage.removeItem("admin");
            setIsLogin(false);
            console.log("response : ",response.data)
            toast.success(response.data.message);
            navigate("/adminlogin")
        } catch (error) {
            console.log("error is : ",error)
            //toast.error(error.response.data.errors || "Error in log out")
        }
    }
  return (
    <div className='flex flex-col space-y-2 text-center p-4 '>
        <div className='text-end px-4'>
            <button onClick={handleLogout} className='text-right px-4 py-1 border rounded-1xl bg-red-700 hover:bg-red-500 duration:300'>logout</button>
        </div>
        <div className='text-2xl font-bold mt-10 text-amber-800'>Hello, Admin</div>
        
        <button onClick={()=>navigate("/ourcourse")} className='bg-amber-500 p-1 text-amber-200 mt-10 border rounded-b-md hover:bg-amber-700'>
            our Courses
        </button>
        <button onClick={()=>navigate("/coursecreate")} className='bg-amber-500 p-1 text-amber-200 border rounded-b-md hover:bg-amber-700'>
            create Course
        </button>
        <button className='bg-amber-500 p-1 text-amber-200 border rounded-b-md hover:bg-amber-700'>
            Home
        </button>
        <button onClick={()=>navigate("/admindashboard")} className='bg-amber-500 p-1 text-amber-200 border rounded-b-md hover:bg-amber-700'>
            logout
        </button>
    </div>
  )
}

export default Admindashboard
import axios from 'axios';
import React, { useState } from 'react'
import { toast } from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom'

function Buy() {
  const navigate = useNavigate()
  const {courseId} = useParams()
  const [loading,setLoading] = useState(false)


  async function handlePurchase(){
    
    const token = localStorage.getItem('user');
    // console.log("token : ",token)
    // console.log('courseId :',courseId)
    if(!token){
      toast.error('log in first to buy course')
      return
    }
    try {
      setLoading(true)
      const response = await axios.post(`http://localhost:4001/api/v1/course/buy/${courseId}`,{},{
        headers:{Authorization : `Bearer ${token}`},
        withCredentials : true
      } )
      console.log("response after buying : ",response.data)
      // if(response.data.msg === 'user have already purchased this course'){
      //   toast.error('course Already purchased');
      //   setLoading(false)
      //   return
      // }
      toast.success('purchase successfull')
      navigate('/purchases')
      setLoading(false)
      
    } catch (error) {

      //console.log(error.response.data)
      setLoading(false)
      if(error.status == 400){
        toast.error(error.response.data)
        return
      }
      console.log(error)
      toast.error('some error occured')
      //toast.error(error.response.data);
    }
  }

  return (
    <div className='flex h-screen items-center justify-center'>
      <button onClick={handlePurchase} className='bg-blue-500 border px-4 py-2 rounded-b-sm hover:bg-blue-800 duration-300'>
        {loading ? 'processing...' : 'buy now' }
      </button>
    </div>
  )
}

export default Buy
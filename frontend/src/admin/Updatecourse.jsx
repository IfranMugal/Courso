import React, { useEffect, useState } from 'react'
import reactLogo from '../assets/react.svg'
import { Link, useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'
function Updatecourse() {
    const navigate = useNavigate();
    const {courseId} = useParams("")
    const admin= JSON.parse(localStorage.getItem("admin"))
    const token = admin.token
    useEffect(()=>{
      console.log("course id fron params : ",courseId)
      console.log("admin's token from localstorage is : ",token)
    },[])


    const[title,setTitle] = useState("");
    const[description,setDescription] = useState("");
    const[price,setPrice] = useState("");
    const[image,setImage] = useState("");
    const[error,setError] = useState("");

    async function handleSubmit(e){
        e.preventDefault();
        console.log("form submitted")
        try {
          const response = await axios.put(`http://localhost:4001/api/v1/course/update/${courseId}`,{
            title,
            description,
            price,
            image
          },{
            withCredentials : true,
            headers : {
              Authorization : `Bearer ${token}`
            }
          })
          // if(response.data == "User with this email already exists"){
          //   setError("User with this email already exists")
          // }else{
          //   toast.success(JSON.stringify(response.data));
          //   navigate('/adminlogin')
          // }
          console.log("server response :",response.data.message);
          toast.success(response.data.message)
          navigate("/ourcourse")
        } catch (e) {
          setError(e.response.data.message);
          toast.error(e.response.data.message)
          console.log("error :", e.response.data.message)
          navigate("/ourcourse")
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
                        <Link to={"/adminlogin"} className=' bg-transparent px-2 py-2 border border-white rounded'>Log In</Link>
                        {/*<Link to={"/signup"} className=' bg-transpsarent px-2 py-2 border border-white rounded'>Sign Up</Link>*/}
                    </div>
                </header>
    
                {/* form */}
                <div className='bg-gray-900 px-10 py-5 rounded-lg shadow-lg m-10 w-[400px] mx-auto'>
                  <h2 className='text-center text-2xl text-orange-500'>create course</h2>
                  <p className='text-center text-sm text-gray-400'>Hello Admin</p>
                  <form onSubmit={handleSubmit}>
                    <div className="flex flex-col my-4">
                      <label htmlFor="title" className="text-gray-400 text-sm mt-2">title</label>
                      <input 
                        id="title"
                        type="text"
                        value={title}
                        onChange={(e)=>setTitle(e.target.value)}
                        className="w-full h-10 bg-gray-800 p-3 rounded-md"
                        placeholder='title'
                      />
                      <label htmlFor="description" className="text-gray-400 text-sm mt-2">description</label>
                      <input 
                        id="description"
                        type="text"
                        value={description}
                        onChange={(e)=>setDescription(e.target.value)}
                        className="w-full h-10 bg-gray-800 p-3 rounded-md"
                        placeholder='description'
                      />
                      <label htmlFor="price" className="text-gray-400 text-sm mt-2">Price</label>
                      <input 
                        id="price"
                        type="text"
                        value={price}
                        onChange={(e)=>setPrice(e.target.value)}
                        className="w-full h-10 bg-gray-800 p-3 rounded-md"
                        placeholder='price'
                      />
                      <label htmlFor="image" className="text-gray-400 text-sm mt-2">image url</label>
                      <input 
                        id="image"
                        type="text"
                        value={image}
                        onChange={(e)=>setImage(e.target.value)}
                        className="w-full h-10 bg-gray-800 p-3 rounded-md"
                        placeholder='image url'
                      />
                      {error && (
                        <div className='text-sm text-red-400'>{error}</div>
                      )}
                      <button type="submit" className='bg-orange-500 text-semi-bold py-2 mt-2 border rounded-md hover:bg-green-500 duraion-300 cursor-pointer'>submit</button>
                    </div>
                  </form>
                </div>
    
                
            </div>
        </div>
      )
}

export default Updatecourse
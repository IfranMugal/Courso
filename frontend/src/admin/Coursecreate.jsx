import React, { useEffect, useState } from 'react'
import reactLogo from '../assets/react.svg'
import { Link, useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'



function Coursecreate() {
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
    const[imagePreview,setImagePreview] = useState("");
    const[error,setError] = useState("");

    function changePhotoHandler(e){
        const file = e.target.files[0]
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload=()=>{
            setImagePreview(reader.result)
            setImage(file)
        }
    }

    async function handleCreateCourse(e){
        e.preventDefault();

        const formdata = new FormData()
        formdata.append("title",title)
        formdata.append("description",description)
        formdata.append("price",price)
        formdata.append("image",image)


        console.log("form submitted")
        try {
          const response = await axios.post(`http://localhost:4001/api/v1/course/create`,formdata,{
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
          // console.log("server response :",response);
          setTitle("")
          setDescription("")
          setImage("")
          setImagePreview("")
          setPrice("")
          setError("")
          toast.success(response.data.message)
          navigate("/ourcourse")
        } catch (e) {
          setError(e.response.data.message);
          toast.error(e.response.data.message)
          console.log("error :", e.response.data.message)
        //   navigate("/ourcourse")
        }
      }


      return (
        <div>
          <div className="min-h-screen  py-10">
            <div className="max-w-4xl mx-auto p-6 border  rounded-lg shadow-lg">
              <h3 className="text-2xl font-semibold mb-8">Create Course</h3>
    
              <form onSubmit={handleCreateCourse} className="space-y-6">
                <div className="space-y-2">
                  <label className="block text-lg">Title</label>
                  <input
                    type="text"
                    placeholder="Enter your course title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-400   rounded-md outline-none"
                  />
                </div>
    
                <div className="space-y-2">
                  <label className="block text-lg">Description</label>
                  <input
                    type="text"
                    placeholder="Enter your course description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-400   rounded-md outline-none"
                  />
                </div>
    
                <div className="space-y-2">
                  <label className="block text-lg">Price</label>
                  <input
                    type="number"
                    placeholder="Enter your course price"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-400   rounded-md outline-none"
                  />
                </div>
    
                <div className="space-y-2">
                  <label className="block text-lg">Course Image</label>
                  <div className="flex items-center justify-center">
                    <img
                      src={imagePreview ? `${imagePreview}` : "/imgPL.webp"}
                      alt="Image"
                      className="w-full max-w-sm h-auto rounded-md object-cover"
                    />
                  </div>
                  <input
                    type="file"
                    onChange={changePhotoHandler}
                    className="w-full px-3 py-2 border border-gray-400   rounded-md outline-none"
                  />
                </div>
                {error ? <div className='text-red-500 text-sm'>
                    {error}
                </div>: <></>}
    
                <button
                  type="submit"
                  className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors duration-200"
                >
                  Create Course
                </button>
              </form>
            </div>
          </div>
        </div>
      );
}

export default Coursecreate
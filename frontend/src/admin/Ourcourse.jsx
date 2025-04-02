import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import { BsEmojiFrownFill } from "react-icons/bs";
import Admindashboard from "./Admindashboard";

const CourseCard = ({ course , admin}) => {
    const navigate = useNavigate()
  
    return (
      <div className="bg-gray-900 rounded-lg overflow-hidden p-4 transition-transform duration-300 transform hover:scale-105">
        <img
          className="h-32 w-full object-contain"
          src={course.image.url}
          alt={course.title}
        />
        <div className="p-6 text-center">
          <h2 className="text-xl font-bold text-white">{course.title}</h2>
          <h3 className="text-xl text-white">Price: {course.price}</h3>
          <div className="flex flex-col">
          <button onClick={()=>navigate(`/updatecourse/${course._id}`)} className="mt-2 px-5 py-2 bg-orange-500 rounded-full hover:bg-orange-300 duration-300">
            update
          </button>
          <button onClick={()=>handleDelete(course,admin)} className="mt-2 px-5 py-2 bg-red-700 rounded-full hover:bg-red-500 duration-300">
            delete
          </button>
          </div>
        </div>
      </div>
    );
};

async function handleDelete(course,admin){
    console.log("from handle delete : ")
    console.log("course : ",course)
    console.log("courseId : ",course._id)
    console.log("admin : ",admin)
    console.log("admin token is : ",admin.token)

    try {
        const response = await axios.delete(`http://localhost:4001/api/v1/course/delete/${course._id}`, {
        headers: { Authorization: `Bearer ${admin.token}` },
        withCredentials: true
    });

    toast.success(response.data.message)
    toast.custom("refresh the page")
    } catch (error) {
        toast.error(error.response.data.message)
        console.log("catched error is : ",error.response.data.message)
    }
}

function Ourcourse() {
    const navigate = useNavigate();
    const [courses, setCourses] = useState([]);
    const [isLogin, setIsLogin] = useState(false);
    const [loading, setLoading] = useState(true);  // ✅ Add loading state
    const admin = JSON.parse(localStorage.getItem("admin"))
    const token = admin?.token;
    console.log("inside urcourses : token is : ",token)
  
    useEffect(() => {
      if (admin) {
        setIsLogin(true);
      } else {
        setIsLogin(false);
      }
      setLoading(false);  // ✅ Mark loading complete after checking login status
    }, []);
  
    useEffect(() => {
      if (!loading && isLogin === false) {  // ✅ Only redirect if `loading` is false
        toast.error("Login to access courses");
        navigate("/adminlogin");
      }
    }, [isLogin, loading]);  // ✅ Depend on both `isLogin` and `loading`
  
    useEffect(() => {
      async function fetchCourses() {
        try {
          const response = await axios.get(
            `http://localhost:4001/api/v1/course/getCourses`
          );
          setCourses(response.data.courses);
        } catch (error) {
          console.error("Error fetching courses:", error);
        }
      }
      fetchCourses();
    }, []);

    // async function handleLogout(){
    //     try {
    //         const response = await axios.post('http://localhost:4001/api/v1/admin/logout',{},{
    //             withCredentials: true
    //         })
    //         localStorage.removeItem("admin");
    //         setIsLogin(false);
    //         console.log("response : ",response.data)
    //         toast.success(response.data.message);
    //     } catch (error) {
    //         console.log("error is : ",error)
    //         //toast.error(error.response.data.errors || "Error in log out")
    //     }
    // }
  
    return (
      <div className="flex h-screen">
        
  
        {/* Main Content */}
        <div className="flex flex-col flex-1">
          {/* Header */}
          <div className="flex h-16 items-center justify-between p-4 bg-gray-400">
            <div className="text-2xl">Courses</div>
            <button onClick={()=>{navigate('/admindashboard')}} className="bg-gray-600 px-4 py-2 border rounded-2xl hover:bg-gray-500 duration-300">
                back
            </button>
          </div>
  
          {/* Courses Section (Scroll Only This) */}
          <div className="flex-1 overflow-y-auto p-4 bg-gray-100">
            <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {courses && courses.length > 0 ? courses.map((course) => (
                <CourseCard key={course._id} course={course} admin={admin} />
              )) : 
              <div className="space-x-2">
                <BsEmojiFrownFill className="text-4xl" />
                <div className=" text-gray-600 w-80 text-lg font-semibold my-auto mx-auto">sorry no relevant courses available</div>
              </div>
              }
            </div>
          </div>
        </div>
      </div>
    );
}

export default Ourcourse
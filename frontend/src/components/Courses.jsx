import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";
import { TbHomeFilled } from "react-icons/tb";
import { IoCloudDownloadSharp, IoLogOut } from "react-icons/io5";
import { FaClipboardList } from "react-icons/fa";
import { BsEmojiFrownFill } from "react-icons/bs";


const CourseCard = ({ course }) => {
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
        <button onClick={()=>navigate(`/buy/${course._id}`)} className="mt-2 px-5 py-2 bg-orange-500 rounded-full hover:bg-blue-500 duration-300">
          Enroll
        </button>
      </div>
    </div>
  );
};

function Courses() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [isLogin, setIsLogin] = useState(false);
  const [filter,setFilter] = useState("");
  const [loading, setLoading] = useState(true);  // ✅ Add loading state

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      setIsLogin(true);
    } else {
      setIsLogin(false);
    }
    setLoading(false);  // ✅ Mark loading complete after checking login status
  }, []);

  useEffect(() => {
    if (!loading && isLogin === false) {  // ✅ Only redirect if `loading` is false
      toast.error("Login to access courses");
      navigate("/login");
    }
  }, [isLogin, loading]);  // ✅ Depend on both `isLogin` and `loading`

  useEffect(() => {
    async function fetchCourses() {
      try {
        const response = await axios.get(
          `http://localhost:4001/api/v1/course/getCourses?filter=${filter}`
        );
        setCourses(response.data.courses);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    }
    fetchCourses();
  }, [filter]);

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar 
      style={{ 
        backgroundColor: "#13395e", // ✅ Uniform sidebar background
        height: "100vh", 
        
        borderRight: "px solid #13395e" // ✅ Optional border for sidebar
      }}
    >
      {/* Welcome Text */}
      <div className="text-2xl text-black font-bold mt-4 ml-1 pb-3">
        Explore
      </div>

      {/* Menu Items */}
      <Menu
        menuItemStyles={{
          button: {
            backgroundColor: "#b6c8d9", // ✅ Same as sidebar
            color: "#13395e", // ✅ Default text color
            border: "1px solid #13395e", // ✅ Border around buttons
            borderRadius: "6px", // ✅ Slightly rounded buttons
            padding: "1px", // ✅ Better spacing

            // Hover Effect
            "&:hover": {
              backgroundColor: "#4b5563", // ✅ Hover background
              color: "white", // ✅ Hover text
              border: "2px solid white", // ✅ Change border on hover
            },

            // Active Button Style
            "&.active": {
              backgroundColor: "#13395e",
              color: "#b6c8d9",
            },
          },
        }}
      >
        <MenuItem component={<Link to="/home" />} icon={<TbHomeFilled />}>home </MenuItem>
        <MenuItem component={<Link to="/Courses" />} icon={<FaClipboardList/>}> Courses </MenuItem>
        <MenuItem component={<Link to="/Purchases" />} icon={<IoCloudDownloadSharp />}> Purchases </MenuItem>
        <MenuItem component={<Link to="/home" />} icon={<IoLogOut />}> Logout </MenuItem>
      </Menu>
    </Sidebar>

      {/* Main Content */}
      <div className="flex flex-col flex-1">
        {/* Header */}
        <div className="flex h-16 items-center justify-between p-4 bg-gray-400">
          <div className="text-2xl">Courses</div>
          <div className="flex space-x-2">
            <input id="filter" type="text" placeholder="search" value={filter} onChange={e => setFilter(e.target.value)} className="p-2 border rounded-full border-gray-500 "/>
            <div className="text-2xl border px-4 py-3 rounded-full border-gray-500 ">U</div>
          </div>
        </div>

        {/* Courses Section (Scroll Only This) */}
        <div className="flex-1 overflow-y-auto p-4 bg-gray-100">
          <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {courses && courses.length > 0 ? courses.map((course) => (
              <CourseCard key={course._id} course={course} />
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

export default Courses;

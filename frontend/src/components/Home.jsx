import React, { useEffect, useState } from 'react'
import reactLogo from '../assets/react.svg'
import { Link, useNavigate } from 'react-router-dom'
import { FaFacebook } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import axios from "axios"
import { toast } from 'react-hot-toast';

function Home() {
    const navigate = useNavigate();
    const[courses,setCourses] = useState([]);
    const[islogin,setIslogin] = useState(false);
    
    useEffect(() => {
        if(localStorage.getItem("user")){
            setIslogin(true);
        }
    },[])

    async function handleLogout(){
        try {
            const response = await axios.post('http://localhost:4001/api/v1/user/logout',{},{
                withCredentials: true
            })
            localStorage.removeItem("user");
            setIslogin(false);
            console.log("response : ",response.data)
            toast.success(JSON.stringify(response.data.message));
        } catch (error) {
            toast.error(error.response.data.errors || "Error in log out")
        }
    }

    useEffect(() => {
        async function fetchCourses(){
            try {
                const Courses = await axios.get('http://localhost:4001/api/v1/course/getCourses')
                //console.log(Courses.data.courses)
                setCourses(Courses.data.courses)
                
            } catch (error) {
                console.log("error :",error)
            }
        }
        fetchCourses();
    },[])

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        autoplay:true,
        responsive: [
          {
            breakpoint: 1024,
            settings: {
              slidesToShow: 2,
              slidesToScroll: 1,
            },
          },
          {
            breakpoint: 600,
            settings: {
              slidesToShow: 1,
              slidesToScroll: 1,
            },
          },
        ],
      };
      


  return (
    <div className="bg-gradient-to-t from-black to-blue-950">
        <div className='text-white mx-auto pl-30 pr-30'>
            {/* header component */}
            <header className='flex justify-between p-6 '>

                <div className='flex items-center space-x-2'>
                    <img src={reactLogo} alt="" className='h-10 w-10 rounded-full'></img>
                    <h1 className='text-2xl text-orange-500 font-bold'>C0urs0</h1>
                </div>
                <div className='fles items-center'>
                    {islogin? (
                        <button onClick={handleLogout} className='bg-transparent px-2 py-2 border border-white rounded'>logout</button>
                    ): (
                        <div className='space-x-3'>
                        <Link to={"/login"} className=' bg-transparent px-2 py-2 border border-white rounded'>Log In</Link>
                        <Link to={"/signup"} className=' bg-transpsarent px-2 py-2 border border-white rounded'>Sign Up</Link>
                        </div>
                    )}
                    
                </div>

            </header>

            {/* middle sections */}
            <section className='pt-10'>
                <h1 className='flex justify-center text-4xl text-orange-500 font-bold'>Welcome to C0urs0</h1>
                <h3 className='flex justify-center text-gray-500 font-bold'>The best you can have</h3>
                <div className='flex justify-center space-x-3 pt-5'>
                    <button onClick={()=>navigate('/Courses')} className='bg-green-400 px-6 py-1 border rounded hover:bg-white  duration-300 text-black cursor-pointer'>
                        Explore Courses
                    </button>
                    {islogin? (
                        <button onClick={()=>navigate('/Purchases')} className='bg-green-400 px-6 py-1 border rounded hover:bg-white  duration-300 text-black cursor-pointer'>
                        My Courses
                        </button>
                    ): (
                        <button onClick={()=>alert("no videos are present , as it is a demo web app")} className='bg-green-400 px-6 py-1 border rounded hover:bg-white  duration-300 text-black cursor-pointer'>
                        Courses Videos
                        </button>
                    )}
                </div>
            </section>
            <section className='p-5'>
                <Slider {...settings}>
                    {courses.map((course) => (
                        <div key={course._id} className='p-4'>
                            <div className='relative flex-shrink-0 transition-transform duration-300 transform hover:scale-105'>
                                <div className='bg-gray-900 rounded-lg overflow-hidden'>
                                    <img className='h-32 w-full object-contain' src={course.image.url}/>
                                <div className='p-6 text-center'>
                                    <h2 className='text-xl font-bold text-white'>{course.title}</h2>
                                    <button onClick={()=>navigate('/Courses')} className='mt-2 px-5 py-2 bg-orange-500 rounded-full hover:bg-blue-500 duration-300'>Enroll</button>
                                </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </Slider>
            </section>

            <hr></hr>
            {/* footer component */}
            <footer className='pb-4 grid sm:grid-cols-1 md:grid-cols-3'>
                <div>
                    <div className='flex items-center space-x-2'>
                        <img src={reactLogo} alt="" className='h-10 w-10 rounded-full'></img>
                        <h1 className='text-2xl text-orange-500 font-bold'>hello</h1>
                    </div>
                    <div className='pl-2 pt-2 '>follow us</div>
                    <div className='flex space-x-1 pl-2'><a href=''><FaFacebook className='hover:text-blue-500 duration-300'/></a><a href=''><FaInstagram className='hover:text-pink-500 duration-300'/></a></div>
                </div>
                <div className='text-center'>
                    <h1 className='p-1'>Source code</h1>
                    
                    <p className='text-md text-gray-500 '>Github - </p>
                    <Link to={'https://github.com/IfranMugal/Courso'} className='text-sm text-gray-500 cursor-pointer hover:text-gray-300 duration-300'>Repo link</Link>
                </div>
                <div className='text-right'>
                    <h1 className='pt-1'>Copyrights</h1>
                    <p className='text-sm text-gray-500 pt-2 hover:text-gray-300 duration-300 cursor-pointer'>terms & conditions</p>
                    <p className='text-sm text-gray-500 hover:text-gray-300 duration-300 cursor-pointer'>privacy policy</p>
                    <p className='text-sm text-gray-500 hover:text-gray-300 duration-300 cursor-pointer'>refund & cancellation</p>
                </div>
            </footer>
        </div>
    </div>
  )
}

export default Home
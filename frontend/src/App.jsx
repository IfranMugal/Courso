import React from 'react'
import {Routes,Route} from 'react-router-dom';
import Signup from './components/Signup';
import Login from './components/Login';
import Home from './components/Home';
import { Toaster } from 'react-hot-toast'
import Courses from './components/Courses';
import Purchases from './components/Purchases';
import Buy from './components/Buy';

import Adminsignup from './admin/adminSignup';
import Adminlogin from './admin/Adminlogin';
import Admindashboard from './admin/Admindashboard';
import Coursecreate from './admin/Coursecreate';
import Ourcourse from './admin/Ourcourse';
import Updatecourse from './admin/Updatecourse';


function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/signup" element={<Signup/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/home" element={<Home/>}/>
        <Route path="/courses" element={<Courses/>}/>
        <Route path="/purchases" element={<Purchases/>}/>
        <Route path="/buy/:courseId" element={<Buy/>}/>

        <Route path="/adminsignup" element={<Adminsignup />}/>
        <Route path="/adminlogin" element={<Adminlogin />}/>
        <Route path="/admindashboard" element={<Admindashboard />}/>
        <Route path="/coursecreate" element={<Coursecreate />}/>
        <Route path="/ourcourse" element={<Ourcourse />}/>
        <Route path="/updatecourse/:courseId" element={<Updatecourse />}/>
      </Routes>
      <Toaster />
    </>
  )
}

export default App
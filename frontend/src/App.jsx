import React from 'react'
import {Routes,Route} from 'react-router-dom';
import Signup from './components/Signup';
import Login from './components/Login';
import Home from './components/Home';
import { Toaster } from 'react-hot-toast'
import Courses from './components/Courses';
import Purchases from './components/Purchases';
import Buy from './components/Buy';


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
      </Routes>
      <Toaster />
    </>
  )
}

export default App
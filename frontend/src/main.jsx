import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import React from 'react'
import './index.css'
import App from './App.jsx'
import {BrowserRouter} from "react-router-dom"
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
const stripePromise = loadStripe("pk_test_51R7dSYFpV19tGUpfUpkCVGejtdFN7CItlsrrx3kb3B6IonPrzTT4O240wBL5zBvYJcdVrUHRWKn9dKGfR0Ao0v6D00NOCnCiG0");

createRoot(document.getElementById('root')).render(
  

<Elements stripe={stripePromise}>
  <BrowserRouter>
    <App />
  </BrowserRouter>
</Elements>


)

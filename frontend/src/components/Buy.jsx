import axios from 'axios';
import React, { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast';
import { useNavigate, useParams ,Link} from 'react-router-dom' 
import { useStripe , useElements , CardElement } from "@stripe/react-stripe-js"

function Buy() {
  const navigate = useNavigate()
  const {courseId} = useParams()
  const [loading,setLoading] = useState(false)

  const [course,setCourse] = useState({})
  const [clientsecret,setClientsecret] = useState('')
  const [error,setError] = useState('')

  const user = JSON.parse(localStorage.getItem("user"))
  const token = user.token
  // console.log("token at buy page is : " , token)
  // console.log("user is : ",user)

  const stripe = useStripe() 
  const elements = useElements() 

  const [cardError,setCardError] = useState("")


  useEffect(() => {
    const FetchBuyCourseData = async() => {
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
        setCourse(response.data.course)
        setClientsecret(response.data.clientSecret)
        //toast.success('purchase successfull')
        //navigate('/purchases')
        setLoading(false)
      
      } catch (error) {

        setLoading(false)
        if(error.status == 400){
          setError(error.response.data)
          return
        }
        console.log(error)
        setError('some error occured')
      }
    }  
    FetchBuyCourseData()
  }, [courseId])
  

  async function handlePurchase(){
    // Block native form submission.
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not loaded yet. Make sure to disable
      // form submission until Stripe.js has loaded.
      console.log("stripe or elements not found")
      return;
    }

    // Get a reference to a mounted CardElement. Elements knows how
    // to find your CardElement because there can only ever be one of
    // each type of element.
    setLoading(true)
    const card = elements.getElement(CardElement);

    if (card == null) {
      console.log("card is null")
      setLoading(false)
      return;
    }

    // Use your card Element with other Stripe.js APIs
    const {error, paymentMethod} = await stripe.createPaymentMethod({
      type: 'card',
      card,
    });

    if (error) {
      console.log('Stripe payment methd [error]', error);
      setLoading(false)
      setCardError(error.message) 
    } else {
      console.log('[PaymentMethod]', paymentMethod);
    }

    if(!clientsecret){
      console.log("no client secret found")
      setLoading(false)
      return
    }

    const {paymentIntent, error:confirmError} = await stripe.confirmCardPayment(
      clientsecret,
      {
        payment_method: {
          card: card,
          billing_details: {
            name: user?.user?.firstName,
            email: user?.user?.email
          },
        },
      },
    );
    if(confirmError){
      console.log("conrie error : ",confirmError)
      setCardError(confirmError.message)
    }else{
      console.log("payment successfull and payment Intent returns : ",paymentIntent)
      setCardError(paymentIntent.id);
      const paymentinfo = {
        email : user.user.email,
        userId : user.user._id,
        courseId : courseId,
        paymentid : paymentIntent.id,
        amount : paymentIntent.amount,
        status : paymentIntent.status 

      }
      console.log("payment info : " , paymentinfo)
      await axios.post("http://localhost:4001/api/v1/order",paymentinfo,{
        headers : {
          Authorization : `Bearer ${token}`
        },
        withCredentials : true
      }).then(response => {
        console.log("response after hitting Order : ",response)
      }).catch((error)=>{
        console.log("error after Order : ",error)
      })

      if(!error){
        toast.success("payment successfull")
        navigate("/purchases")
      }

    }
    setLoading(false)
    
  }

  return (
    <>
      {error ? (
        <div className="flex justify-center items-center h-screen">
          <div className="bg-red-100 text-red-700 px-6 py-4 rounded-lg">
            <p className="text-lg font-semibold">{error}</p>
            <Link
              className="w-full bg-orange-500 text-white py-2 rounded-md hover:bg-orange-600 transition duration-200 mt-3 flex items-center justify-center"
              to={"/purchases"}
            >
              Purchases
            </Link>
          </div>
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row my-40 container mx-auto">
          <div className="w-full md:w-1/2">
            <h1 className="text-xl font-semibold underline">Order Details</h1>
            <div className="flex items-center text-center space-x-2 mt-4">
              <h2 className="text-gray-600 text-sm">Total Price</h2>
              <p className="text-red-500 font-bold">${course.price}</p>
            </div>
            <div className="flex items-center text-center space-x-2">
              <h1 className="text-gray-600 text-sm">Course name</h1>
              <p className="text-red-500 font-bold">{course.title}</p>
            </div>
          </div>
          <div className="w-full md:w-1/2 flex justify-center items-center">
            <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-sm">
              <h2 className="text-lg font-semibold mb-4">
                Process your Payment!
              </h2>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm mb-2"
                  htmlFor="card-number"
                >
                  Credit/Debit Card
                </label>
                <form onSubmit={handlePurchase}>
                  <CardElement
                    options={{
                      style: {
                        base: {
                          fontSize: "16px",
                          color: "#424770",
                          "::placeholder": {
                            color: "#aab7c4",
                          },
                        },
                        invalid: {
                          color: "#9e2146",
                        },
                      },
                    }}
                  />

                  <button
                    type="submit"
                    disabled={!stripe || loading} // Disable button when loading
                    className="mt-8 w-full bg-indigo-500 text-white py-2 rounded-md hover:bg-indigo-600 transition duration-200"
                  >
                    {loading ? "Processing..." : "Pay"}
                  </button>
                </form>
                {cardError && (
                  <p className="text-red-500 font-semibold text-xs">
                    {cardError}
                  </p>
                )}
              </div>

              <button className="w-full bg-orange-500 text-white py-2 rounded-md hover:bg-orange-600 transition duration-200 mt-3 flex items-center justify-center">
                <span className="mr-2">🅿️</span> Other Payments Method
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Buy
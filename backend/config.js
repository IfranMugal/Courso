import dotenv from "dotenv"
dotenv.config()

const jwtKey = process.env.JWT_USER_SECRETKEY
const JWT_ADMIN_SECRETKEY = process.env.JWT_ADMIN_SECRETKEY


const STRIPE_SECRET_KEY = 'sk_test_51R7dSYFpV19tGUpfhB0zocETCLDZOEAQX3YQtEzhf37cNO1ZL7oxfhbGw3OBlCieg9x6yMdEqG3FFE3Wi80kqubb004C7DxYFi'

export { jwtKey , JWT_ADMIN_SECRETKEY , STRIPE_SECRET_KEY }
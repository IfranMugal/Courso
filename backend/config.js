import dotenv from "dotenv"
dotenv.config()

const jwtKey = process.env.JWT_USER_SECRETKEY
const JWT_ADMIN_SECRETKEY = process.env.JWT_ADMIN_SECRETKEY
export { jwtKey , JWT_ADMIN_SECRETKEY }
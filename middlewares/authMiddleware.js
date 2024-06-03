const jwt = require("jsonwebtoken")
const User = require("../models/User")

const verifyJWT = async (req, res, next) => {

    const authHeader = req.headers.authorization
    if (!authHeader) {
        return res.status(401).json({ message: "Access denied. Token is missing"})
    }

    const token = authHeader.replace("Bearer", "")

    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY)
        req.user = await User.findById(decodedToken.id)
        console.log("req.user:", req.user)
        next()
    } catch (error) {
        console.error(error)
        return res.status(400).json({ message: "Invalid token."})
    }
}


const adminVerify = async (req, res, next) => {
    if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Access denied. Only for admin."})
    }
    next()
}



// const verifyJWT = (req, res, next) => {
//     const authorizationHeader = req.headers.authorization 

//     // If token is missing
//     if(!authorizationHeader) {
//         return res.status(401).json(
//             {
//                 success: false,
//                 message: "Token is missing"
//             }
//         )
//     }

//     const token = authorizationHeader.replace("Bearer ", "") 

//     jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decodedToken) => { 
//             if (err) {
//                 return res.status(403).json(
//                     {
//                         success: false, 
//                         message: "Invalid token" 
//                     }
//                 )
//             }
//             req.user = decodedToken // user Id (and iat, exp...) from decoded token. To use when creating new note to insert user ID...
//             console.log(req.user)
//             next()
//         }
//     )
// }


module.exports = {verifyJWT, adminVerify}
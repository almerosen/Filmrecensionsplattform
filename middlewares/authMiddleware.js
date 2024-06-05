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


module.exports = {verifyJWT, adminVerify}
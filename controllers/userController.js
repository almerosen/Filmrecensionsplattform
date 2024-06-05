const User = require("../models/User")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

const register = async (req, res) => {
    const { username, email, password, role} = req.body
    try {

        const userExists = await User.findOne({ username: username.toLowerCase() })
        if (userExists) return res.status(400).json({ message: "Username already exists"})

        const user = new User({
            username: username.toLowerCase(),
            email: email,
            password: password,
            role: role || "user"
        })
        await user.save()

        res.status(201).json({ message: "Successfully created user", user})
        
    } catch (error) {
        console.error(error)
        return res.status(500).json({ message: "Failed to create user"})
    }
}

const login = async (req, res) => {
    const {username, password} = req.body
    try {
        const user = await User.findOne({username: username})

        if (!user) {
            return res.status(404).json({ message: "Username does not exist"})
        }

        if (!await bcrypt.compare(password, user.password)) {
            return res.status(400).json({ message: "Wrong password"})
        }
        // Ta bort password för responsen
        const userWithoutPassword = {
            id: user._id,
            username: user.username,
            email: user.email,
            role: user.role
        }

        const token = jwt.sign({ id: user._id, role: user.role}, process.env.JWT_SECRET_KEY, {expiresIn: "1h"})
        res.status(200).json({ message: "Sucessfully logged in", user: userWithoutPassword, token})

    } catch (error) {
        console.error(error)
        return res.status(500).json({ message: "Failed to login"})
    }
}

module.exports = {register, login}
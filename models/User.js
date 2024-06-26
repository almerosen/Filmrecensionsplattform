const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true},
    email: { type: String, required: true, unique: true},
    password: { type: String, required: true},
    role: { type: String, required: true, enum: ["user", "admin"], default: "user"}
})

userSchema.pre('save', async function(next) {
    const user = this

    if (!user.isModified('password')) {
        return next()
    } 

    try {
        const salt = await bcrypt.genSalt(10)
        user.password = await bcrypt.hash(user.password, salt)
        next()
    } catch (error) {
        next(error)
    }

})

module.exports = mongoose.model('User', userSchema)
require("dotenv").config()
const express = require("express")
const connectDB = require("./config/db")
const userRoutes = require("./routes/userRoutes")
const movieRoutes = require("./routes/movieRoutes")
const reviewRoutes = require("./routes/reviewRoutes")

const app = express()
app.use(express.json())

connectDB()

// Routes 
app.use("/api", userRoutes)
app.use("/api/movies", movieRoutes)
app.use("/api/reviews", reviewRoutes)



app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`)
})

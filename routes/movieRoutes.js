const express = require("express")
const router = express.Router()
const movieController = require("../controllers/movieController")
const { verifyJWT, adminVerify } = require("../middlewares/authMiddleware")


router.post("/", verifyJWT, adminVerify, movieController.addMovie)
router.get("/", movieController.getMovies)
router.get("/:id", movieController.getMovieById)
router.put("/:id", verifyJWT, adminVerify, movieController.updateMovie)
router.get("/:id/reviews", movieController.getReviewsByMovieId) // Flytta till reviews?
router.delete("/:id", movieController.deleteMovieById)

module.exports = router
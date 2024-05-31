const express = require("express")
const router = express.Router()
const movieController = require("../controllers/movieController")


router.post("/", movieController.addMovie)
router.get("/", movieController.getMovies)
router.get("/:id", movieController.getMovieById)
router.put("/:id", movieController.updateMovie)
router.get("/:id/reviews", movieController.getReviewsByMovieId) // Flytta till reviews?
router.delete("/:id", movieController.deleteMovieById)

module.exports = router
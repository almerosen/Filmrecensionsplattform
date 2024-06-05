const express = require("express")
const router = express.Router()
const {verifyJWT} = require("../middlewares/authMiddleware")
const reviewController = require("../controllers/reviewController")

// Man måste vara inloggad för att skriva, uppdatera eller radera en recension

router.post("/", verifyJWT, reviewController.addReview)
router.get("/", reviewController.getAllReviews)
router.get("/:id", reviewController.getReviewById)
router.put("/:id", verifyJWT, reviewController.updateReview)
router.delete("/:id", verifyJWT, reviewController.deleteReview  )

module.exports = router
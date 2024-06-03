const Review = require("../models/Review")
const mongoose = require("mongoose")

// POST Lägg till enn ny recension
const addReview = async (req, res) => {
    console.log("addreview req.user:", req.user)
    
    try {
        // Kolla om användaren redan recenserat filmen:
        const existingReview = await Review.findOne({
            movieId: req.body.movieId,
            userId: req.user._id
        })
        if (existingReview) {
            return res.status(400).json({ message: "You have already made a review of this movie"})
        }

        const review = new Review({
            ...req.body,
            userId: req.user._id,
        })
        await review.save()
        res.status(201).json({ message: "Review added successfully", review})

    } catch (error) {
        console.error(error)
        return res.status(500).json({ message: "Failed to add review", error})
    }
}

// GET hämta en lista med alla recensioner
const getAllReviews = async (req, res) => {
    try {
        const reviews = await Review.find().populate("movieId", "title").populate("userId", "username")
        if (reviews.length === 0) {
            return res.status(400).json({ message: "There are no reviews"})
        }
        return res.status(200).json(reviews)
    } catch (error) {
        return res.status(500).json({ message: "Failed to get reviews", error})
    }
}

// GET/reviews/:id: Hämta detaljer för en specifik recension.
const getReviewById = async (req, res) => {
    try {
        const review = await Review.findById(req.params.id).populate("movieId", "title").populate("userId", "username") 
        if (!review) {
            return res.status(404).json({ message: "Review not found"})
        }
        return res.status(200).json(review)
    } catch (error) {
        return res.status(500).json({ message: "Failed to get review", error})
        console.error(error)
    }
}

// PUT /reviews/:id: Uppdatera en specifik recension.
const updateReview = async (req, res) => {
    try {
        const reviewId = req.params.id
        const userId = req.user._id

        if (!mongoose.Types.ObjectId.isValid(reviewId)) {
            return res.status(400).json({ message: "Invalid review ID"})
        }

        const review = await Review.findById(reviewId)

        if (!review) {
            return res.status(400).json({ message: "No review found"})
        }

        // Kolla om recensionen tillhör användaren
        if (review.userId.toString() !== userId.toString()) {
            return res.status(403).json({ message: "You cannot update someone else's review"})
        }

        // Tillåt endast uppdatering av comment och rating 
        const { comment, rating } = req.body
        const updateData = {}

        // Se till så att det skickas in något att uppdatera
        if (comment !== undefined) {
            if (comment.length === 0) {
                return res.status(400).json({ message: "Comment cannot be empty"})
            }
            updateData.comment = comment
        }

        if (rating !== undefined) {
            const numberRating = Number(rating)
            if (rating == "") {
                return res.status(400).json({ message: "Rating cannot be empty"})
            }
            if(isNaN(numberRating) || numberRating < 0 || numberRating > 5 ) {
                return res.status(400).json({ message: "Rating must be a number between 0 and 5"})
            }
            updateData.rating = rating
        }

        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({ message: "Nothing provided to update"})
        }

        const updateReview = await Review.findByIdAndUpdate(reviewId, updateData, { new: true})

        res.status(200).json({ message: "Successfully updated review", updateReview})  
    } catch (error) {
        console.error(error)
        return res.status(500).json({ message: "Failed to update review", error})
    }
}





module.exports = {
    addReview, 
    getAllReviews, 
    getReviewById, 
    updateReview}
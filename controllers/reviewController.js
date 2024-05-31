const Review = require("../models/Review")

const addReview = async (req, res) => {
    try {
        const review = new Review({
            ...req.body,
            userId: req.user._id
        })
        await review.save()
        res.status(201).json(review)
    } catch (error) {
        console.error(error)
        return res.status(500).json({ message: "Failed to add review"})
    }
}

module.exports = {addReview}
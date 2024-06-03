const Movie = require("../models/Movie")  
const mongoose = require("mongoose")

const addMovie = async (req, res) => {
    try {
        const movie = new Movie(req.body)
        await movie.save()
        console.log(req.user)
        return res.status(201).json({ message: "Successfully added a movie", movie})
    } catch (error) {
        res.status(400).json({ message: "Failed to add a movie", error})
    }
}

const getMovies = async (req, res) => {
    try {
        const movies = await Movie.find()
        return res.status(200).json(movies)
    } catch (error) {
        return res.status(500).json({ message: "Failed to retrieve movies", error})
    }
}

const getMovieById = async (req, res) => {
    try {
        const movie = await Movie.findById(req.params.id)
        if (!movie) {
            return res.status(404).json({ message: `No movie found with id ${req.params.id}`})
        }
        return res.status(200).json(movie)
    } catch (error) {
        return res.status(500).json({ message: "Failed to get movie", error})
    }
}

// PUT /movies/:id
// Uppdatera en specifik film
const updateMovie = async (req, res) => {

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: "Invalid movie ID" });
    }

    const updates = Object.keys(req.body)
    const allowedUpdates = ['title', 'director', 'releaseYear', 'genre']
    const isValidKeys = updates.every(update => allowedUpdates.includes(update))

    if (!isValidKeys) {
        return res.status(400).json({ message: "Invalid update fields"})
    }

    try {
        const movie = await Movie.findById(req.params.id)
        if (!movie) {
            return res.status(404).json({ message: "Movie not found"})
        }

        updates.forEach(update => movie[update] = req.body[update])
        await movie.save()

        return res.status(200).json({ message: "Movie updated successfully", movie})

    } catch (error) {
        console.error(error)
        return res.status(400).json({ message: "Failed to update movie", error})
    }
}


// GET /movies/:id/reviews
// Hämta alla recensioner för en specifik film
const getReviewsByMovieId = async (req, res) => {

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: "Invalid ID"})
    }

    try {
        const reviews = await Review.find({ movieId: req.params.id}).populate('userId', 'username')
        if (reviews.length === 0) {
            return res.status(404).json({ message: "No reviews found for the movie"})
        }
        res.status(200).json(reviews)
    } catch (error) {
        console.error(error)
        return res.status(500).json({ message: "Failed to get reviews", error})
    }
}

// DELETE /movies/:id
// Ta bort en specifik film
const deleteMovieById = async (req, res) => {

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: "Invalid ID"})
    }

    try {
        const movie = await Movie.findByIdAndDelete(req.params.id)
        if (!movie) {
            return res.status(404).json({ message: `No movie found with id ${req.params.id}`})
        }
        res.status(200).json({ message: "Movie deleted"})

    } catch (error) {
        console.error(error)
        return res.status(500).json({ message: "Failed to delete movie", error})
    }
}



module.exports = {
    addMovie, 
    getMovies, 
    getMovieById, 
    updateMovie, 
    getReviewsByMovieId,
    deleteMovieById
}
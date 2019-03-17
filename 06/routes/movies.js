const mongoose = require("mongoose");
const express = require("express");
const { Movie, validate } = require("../models/movie");
const { Genre } = require("../models/genre");
const router = express.Router();

/* GET all movies (sorted by name) */
router.get("/", async (req, res) => {
    const movies = await Movie.find().sort("name");
    res.send(movies);
});

/* POST movie (new one) */
router.post("/", async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    //here we are checking if id that client send is a valid genre id, if not
    //then error
    const genre = await Genre.findById(req.body.genreId);
    if (!genre) return res.status(400).send("Invalid genre.");

    const movie = new Movie({
        title: req.body.title,
        genre: { _id: genre._id, name: genre.name },
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate
    });
    await movie.save();

    res.send(movie);
});

/* PUT movie (replace existing one with new one) */
router.put("/:id", async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const genre = await Genre.findById(req.body.genreId);
    if (!genre) return res.status(400).send("Invalid genre.");

    const movie = await Movie.findByIdAndUpdate(
        req.params.id,
        {
            title: req.body.title,
            genre: { _id: genre._id, name: genre.name },
            numberInStock: req.body.numberInStock,
            dailyRentalRate: req.body.dailyRentalRate
        },
        {
            new: true
        }
    );

    if (!movie)
        return res
            .status(404)
            .send("The movie with the given ID was not found.");

    res.send(movie);
});

/* DELETE genre */
router.delete("/:id", async (req, res) => {
    const movie = await Movie.findByIdAndRemove(req.params.id);

    if (!movie)
        return res
            .status(404)
            .send("The movie with the given ID was not found.");

    res.send(movie);
});

/* GET one genre (by id) */
router.get("/:id", async (req, res) => {
    const movie = await Movie.findById(req.params.id);

    if (!movie)
        return res
            .status(404)
            .send("The movie with the given ID was not found.");

    res.send(movie);
});

module.exports = router;

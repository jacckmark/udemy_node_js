const mongoose = require("mongoose");
const express = require("express");
const { Genre, validate } = require("../models/genre");
const router = express.Router();
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

/* GET all genres (sorted by name) */
router.get("/", auth, async (req, res) => {
    const genres = await Genre.find().sort("name");
    res.send(genres);
});

/* POST genre (new one) */
router.post("/", auth, async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const genre = new Genre({ name: req.body.name });
    await genre.save();

    res.send(genre);
});

/* put genre (replace existing one with new one) */
router.put("/:id", auth, async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const genre = await Genre.findByIdAndUpdate(
        req.params.id,
        { name: req.body.name },
        {
            new: true
        }
    );

    if (!genre)
        return res
            .status(404)
            .send("The genre with the given ID was not found.");

    res.send(genre);
});

/* DELETE genre */
router.delete("/:id", [auth, admin], async (req, res) => {
    //here we are using two middleware functions
    const genre = await Genre.findByIdAndRemove(req.params.id);

    if (!genre)
        return res
            .status(404)
            .send("The genre with the given ID was not found.");

    res.send(genre);
});

/* GET one genre (by id) */
router.get("/:id", auth, async (req, res) => {
    const genre = await Genre.findById(req.params.id);

    if (!genre)
        return res
            .status(404)
            .send("The genre with the given ID was not found.");

    res.send(genre);
});

module.exports = router;

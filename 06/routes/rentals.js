const { Rental, validate } = require("../models/rental");
const { Movie } = require("../models/movie");
const { Customer } = require("../models/customer");
const mongoose = require("mongoose");
//fawn is a npm package which implements something similar to a transactions in
//mongoDB using two phase commits (fawn is solely for this purpose creating a new
//collection named 'ojlinttaskcollections' in our mongoDB database)
const Fawn = require("fawn");
const express = require("express");
const router = express.Router();

//we have to init a fawn in a file where we will be using it
Fawn.init(mongoose);

router.get("/", async (req, res) => {
    //get is showing our rentals documents sorted by date (descending)
    const rentals = await Rental.find().sort("-dateOut");
    res.send(rentals);
});

router.post("/", async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    //check if such customer exist in customer collection
    const customer = await Customer.findById(req.body.customerId);
    if (!customer) return res.status(400).send("Invalid customer.");

    //check if such movie exist in movie collection
    const movie = await Movie.findById(req.body.movieId);
    if (!movie) return res.status(400).send("Invalid movie.");

    //we are checking if movie is available if not we cannot do post of rental
    if (movie.numberInStock === 0)
        return res.status(400).send("Movie not in stock.");

    let rental = new Rental({
        customer: {
            _id: customer._id,
            name: customer.name,
            phone: customer.phone
        },
        movie: {
            _id: movie._id,
            title: movie.title,
            dailyRentalRate: movie.dailyRentalRate
        }
        //we don't define dateOut etc. because this are the values that will be
        //chaged when needed with put method and right now we don't even know
        //when the rental will be returned 
    });

    try {
        //first parameter of a save method in Fawn is name of the collection
        //(beware case sensitive)
        new Fawn.Task()
            //saving new rental
            .save("rentals", rental)
            //updating numberInStock in a movie object
            .update(
                "movies",
                { _id: movie._id },
                { $inc: { numberInStock: -1 } }
            )
            .run();

        res.send(rental);
    } catch (ex) {
        res.status(500).send("Something failed.");
    }
});

router.get("/:id", async (req, res) => {
    const rental = await Rental.findById(req.params.id);

    if (!rental)
        return res
            .status(404)
            .send("The rental with the given ID was not found.");

    res.send(rental);
});

module.exports = router;

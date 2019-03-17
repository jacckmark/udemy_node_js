const Joi = require("joi");
const mongoose = require("mongoose");
//importing and destructuring (we need genre schema and defining it once again
//here would be unwanted)
const { genreSchema } = require("./genre");

const Movie = mongoose.model(
    "Movies",
    new mongoose.Schema({
        title: {
            type: String,
            required: true,
            trim: true,
            minlength: 5,
            maxlength: 250
        },
        genre: { type: genreSchema, required: true },
        numberInStock: { type: Number, required: true, min: 0, max: 255 },
        dailyRentalRate: { type: Number, required: true, min: 0, max: 255 }
    })
);

function validateMovie(movie) {
    const schema = {
        title: Joi.string()
            .min(5)
            .max(50)
            .required(),
        //here Joi schema is a little bit different than object schema because
        //from user we want only genreId (so we validate just this), because users
        //will be sending to us only id, schema is just for data representation
        genreId: Joi.objectId().required(),
        numberInStock: Joi.number()
            .min(0)
            .required(),
        dailyRentalRate: Joi.number()
            .min(0)
            .required()
    };

    return Joi.validate(movie, schema);
}

exports.validate = validateMovie;
exports.Movie = Movie;

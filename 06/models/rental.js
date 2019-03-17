const Joi = require("joi");
const mongoose = require("mongoose");

const Rental = mongoose.model(
    "Rental",
    new mongoose.Schema({
        //here we are not using schema from customer or movie model because we
        //don't need all these informations, so we are storing only fields that
        //have (for us) some valuable data
        customer: {
            type: new mongoose.Schema({
                name: {
                    type: String,
                    required: true,
                    minlength: 5,
                    maxlength: 50
                },
                isGold: {
                    type: Boolean,
                    default: false
                },
                phone: {
                    type: String,
                    required: true,
                    minlength: 5,
                    maxlength: 50
                }
            }),
            required: true
        },
        movie: {
            type: new mongoose.Schema({
                title: {
                    type: String,
                    required: true,
                    trim: true,
                    minlength: 5,
                    maxlength: 255
                },
                dailyRentalRate: {
                    type: Number,
                    required: true,
                    min: 0,
                    max: 255
                }
            }),
            required: true
        },
        dateOut: {
            type: Date,
            required: true,
            default: Date.now
        },
        dateReturned: {
            type: Date
        },
        rentalFee: {
            type: Number,
            min: 0
        }
    })
);

function validateRental(rental) {
    //because rental object contains few date objects and refrences to another
    //objects we validate just whether user passed a ids when doing request
    const schema = {
        //here we are validating if an object id is valid one with library joi-
        //objectid (imported in index.js)
        customerId: Joi.objectId().required(),
        movieId: Joi.objectId().required()
    };

    return Joi.validate(rental, schema);
}

exports.Rental = Rental;
exports.validate = validateRental;

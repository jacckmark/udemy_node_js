const Joi = require("joi");
const mongoose = require("mongoose");

const Genre = mongoose.model(
    "Genre",
    new mongoose.Schema({
        name: {
            type: String,
            required: true,
            minlength: 5,
            maxlength: 50
        }
    })
);

/* pre write validation with JOI (all data is also validate by a mongoose schema
but it is a good practice to validate more than once) */
function validateGenre(genre) {
    const schema = {
        name: Joi.string()
            .min(5)
            .max(50)
            .required()
    };

    return Joi.validate(genre, schema);
}

exports.validate = validateGenre;
exports.Genre = Genre; 

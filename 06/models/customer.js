const Joi = require("joi");
const mongoose = require("mongoose");

const Customer = mongoose.model(
    "Customer",
    new mongoose.Schema({
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
            minlength: 6,
            maxlength: 20
        }
    })
);

function validateCustomer(customer) {
    const schema = {
        name: Joi.string()
            .min(5)
            .max(50)
            .required(),
        isGold: Joi.boolean(),
        phone: Joi.string()
            .min(6)
            .max(20)
    };

    return Joi.validate(customer, schema);
}

module.exports.Customer = Customer;
module.exports.validate = validateCustomer;
//we can write it also like this 
// exports.validate = validateCustomer;
  
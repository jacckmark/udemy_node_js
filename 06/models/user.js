const Joi = require("joi");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const config = require("config");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: /\S+@\S+\.\S+/,
        minlength: 5,
        maxlength: 255
    },
    password: {
        type: String,
        required: true,
        minlength: 10,
        maxlength: 1024
    },
    isAdmin: Boolean
});

//we cannot use here arrow function because this will not be pointing at object
//but at a calling function (so we wont be able to get information about object
//id)
userSchema.methods.generateAuthToken = function() {
    const token = jwt.sign(
        { _id: this._id, isAdmin: this.isAdmin },
        config.get("jwtPrivateKey")
    );
    return token;
};

const User = mongoose.model("User", userSchema);

function validateUser(user) {
    const schema = {
        name: Joi.string()
            .min(3)
            .max(50)
            .required(),
        email: Joi.string()
            .email()
            .min(5)
            .max(255)
            .required(),
        password: Joi.string()
            .min(10)
            .max(255)
            .required()
    };

    return Joi.validate(user, schema);
}

exports.validate = validateUser;
exports.User = User;

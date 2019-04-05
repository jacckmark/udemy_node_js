const _ = require("lodash");
const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { User, validate } = require("../models/user");
const router = express.Router();
const jwt = require("jsonwebtoken");
const config = require("config");
const auth = require("../middleware/auth");

/* GET all users (sorted by name) */
router.get("/", async (req, res) => {
    const users = await User.find().sort("name");
    res.send(users);
});

/* POST users (new one) */
router.post("/", async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    //checking if such user is not present in our database if it is true then
    //we cannot register such user and we return from function
    let user = await User.findOne({ email: req.body.email });
    if (user)
        return res.status(400).send("User already registred on this email.");

    //here using lodash method we are choosing what data send to an end we are
    //saving in a database (it is shorter version than writing req.body.name for
    //every single property)
    user = new User(_.pick(req.body, ["name", "email", "password"]));
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    await user.save();

    const token = user.generateAuthToken();

    //pick method from lodash gets you only variables from an object that you
    //request and returns them in form of new object (here we are ommiting
    //password from user object properties returned to user)
    res.header("x-auth-token", token).send(
        _.pick(user, ["_id", "name", "email"])
    );
});

/* put user (replace existing one with new one) */
router.put("/:id", async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const user = await User.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
        },
        {
            new: true
        }
    );

    if (!user)
        return res
            .status(404)
            .send("The user with the given ID was not found.");

    res.send(user);
});

/* DELETE user */
router.delete("/:id", async (req, res) => {
    const user = await User.findByIdAndRemove(req.params.id);

    if (!user)
        return res
            .status(404)
            .send("The user with the given ID was not found.");

    res.send(user);
});

/* GET one user (by id) */
router.get("/me", auth, async (req, res) => {
    //we are excluding password from a list of returned values
    const user = await User.findById(req.user._id).select("-password");

    res.send(user);
});

module.exports = router;

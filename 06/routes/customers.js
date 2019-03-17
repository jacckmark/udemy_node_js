const mongoose = require("mongoose");
const express = require("express");
//object destructuring we write customer schema from file customers.js (in folder
//models) to Customer property and joi function for validation to validate 
//property
const { Customer, validate } = require("../models/customer");
const router = express.Router();

/* GET all customers (sorted by name) */
router.get("/", async (req, res) => {
    const customers = await Customer.find().sort("name");
    res.send(customers);
});

/* POST customer (new one) */
router.post("/", async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const customer = new Customer({
        name: req.body.name,
        isGold: req.body.isGold,
        phone: req.body.phone
    });
    await customer.save();

    res.send(customer);
});

/* PUT customer (replace existing one with new one) */
router.put("/:id", async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const customer = await Customer.findByIdAndUpdate(
        req.params.id,
        { name: req.body.name, isGold: req.body.isGold, phone: req.body.phone },
        {
            new: true
        }
    );

    if (!customer)
        return res
            .status(404)
            .send("The customer with the given ID was not found.");

    res.send(customer);
});

/* DELETE customer */
router.delete("/:id", async (req, res) => {
    const customer = await Customer.findByIdAndRemove(req.params.id);

    if (!customer)
        return res
            .status(404)
            .send("The customer with the given ID was not found.");

    res.send(customer);
});

/* GET one customer (by id) */
router.get("/:id", async (req, res) => {
    const customer = await Customer.findById(req.params.id);

    if (!customer)
        return res
            .status(404)
            .send("The customer with the given ID was not found.");

    res.send(customer);
});

module.exports = router;

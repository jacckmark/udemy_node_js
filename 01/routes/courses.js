const express = require("express");
//in files other than default (here index.js) we use router instead of app on
//the end of file we have to export router, in index.js we need also to import
//router
const router = express.Router();
//to validate requests
const Joi = require("joi");

const courses = [
    { id: 1, name: "course1" },
    { id: 2, name: "course2" },
    { id: 3, name: "course3" },
    { id: 4, name: "course4" },
    { id: 5, name: "course5" },
    { id: 6, name: "course6" },
    { id: 7, name: "course7" },
    { id: 8, name: "course8" }
];

//route returning courses array
router.get("/", (req, res) => {
    res.send(courses);
});

//when we have endpoint like this we dont have to say in url id=10 we can just
//pass this like 'api/courses/10', this we are calling route parameters (parame-
//ters after a '?' sign are query parameters (we use them when we need to for
//example sort our result))
router.get("/:id", (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) {
        //when we dont have course with such a course number (id)
        return res.status(404).send("Course with the given id was not found!");
    } else {
        //sending choosen course
        res.send(course);
    }
});

//adding a course
router.post("/", (req, res) => {
    //we get only result.error (object destructuring)
    const { error } = validateCourse(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }
    //creating new course object
    const course = { id: courses.length + 1, name: req.body.name };
    //adding new courses object
    courses.push(course);
    //returning object in response
    res.send(course);
});

//updating existing course
//thanks to defining it in index.js we dont have to explicitly pass route every
//single time we are defining a method (because all /api/courses methods are 
//handled by this file)
router.put("/:id", (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) {
        res.status(404).send("Course with the given id was not found!");
    } else {
        //we get only result.error (object destructuring)
        const { error } = validateCourse(req.body);
        if (error) {
            return res.status(400).send(error.details[0].message);
        }
        course.name = req.body.name;
        res.send(course);
    }
});

//removing course from a list
router.delete("/:id", (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) {
        //return exits a function so nothing else will be executed
        return res.status(404).send("Course with the given id was not found!");
    } else {
        const index = courses.indexOf(course);
        courses.splice(index, 1);
        res.send(course);
    }
});

function validateCourse(course) {
    const schema = {
        //using Joi requires defining schema (here we say that all name
        //properties should be strings, 3 characters long and are required)
        name: Joi.string()
            .min(3)
            .required()
    };
    //returning object of validation result
    return Joi.validate(course, schema);
}

module.exports = router;

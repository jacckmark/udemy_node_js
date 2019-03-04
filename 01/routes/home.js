const express = require("express");
const router = express.Router();

//handling default route on our app (we return a response Hello World)
router.get("/", (req, res) => {
    //in express we have something called middleware function (function that
    //takes request and returns response to the client (this example) or pases
    //control to another middleware function (for example function
    //app.use(express.json()) )),
    //res.send("Hello world!");

    //res render sets properties of title and message for file index, this way
    //when we call default route we will get html (generated from index.pug)
    //with hello world greeting
    res.render("index", {
        title: "My express app",
        message: "Hello World from pug " + "template"
    });
});

module.exports = router;
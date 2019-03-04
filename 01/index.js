//app securing by settin various HTTP headers
const helmet = require("helmet");
//for logging requests to a server (every single request to the server should
//be logged), it can be configured to log to the file (default it logs to the
//console)
const morgan = require("morgan");
//npm package helping with managing different settings for different environments
//like production, development etc.
const config = require("config");
//package for debugging, using only when we have defined variable DEBUG set for
//app:startup (system environment variable 'export DEBUG=app:startup')
const startUpDebbuging = require("debug")("app:startup");
const express = require("express");

//importing route with courses CRUD operations
const courses = require("./routes/courses");
const home = require("./routes/home");
//calling custom middleware function located in another file
const logger = require("./middleware/logger");
const app = express();

//to set different environment (production, development etc. (names are matching
//file names in config folder) run in terminal 'export NODE_ENV=development')
console.log("Application name: " + config.get("name"));
console.log("Mail server: " + config.get("mail.host"));

//to use json in express
app.use(express.json()); //parsing request like a JSON {key1:value1,key2:value2}
app.use(express.urlencoded({ extended: true })); //parsing request like
//key=value&key2=value2, also extended option gives us a way to parse more
//complex objects and arrays
app.use(express.static("public")); //gives us a way to access files in our
//project (to serve static files) in directory public (name of our folder), to
//access them just type name of the file after our server address
app.use(helmet());
//here explicitly defining that every route api/courses should be handled by
//imported courses route (thanks to this we don't have to say every time that
//route should be 'api/courses)
app.use("/api/courses", courses);
app.use("/", home);
//templating engine pug (using in project does not require requiring it we have
//to only call set on it), we need it when we would like to return  to user
//some html pages, instead of informations and processing it with some frontend,
//other examples of view/template  engines are: ejb, pug, moustache
app.set("view engine", "pug");
app.set("views", "./views"); //this is the default setting but if we would like to
//set template storage place somewhere else we would call this

//enable morgan only in development not on production, based on environment
//variable env
if (app.get("env") === "development") {
    //tiny option returns just a small amount of information about request
    //(one line)
    app.use(morgan("tiny"));
    //using a debugger
    startUpDebbuging("Morgan enabled right now...");
}

app.use(logger);

app.use(function(req, res, next) {
    console.log("Authenticating...");
    //middlware functions are called in sequence
    next();
});

//in real app we dont point to exact port, we are providing it in environment
//variables, in system environment variables (in cmd or terminal export
//PORT=5000 for example)
const port = process.env.PORT || 3000;
//pointing where on the localhost we are listening to requests and printing
//this information in the node terminal
app.listen(port, () => console.log(`Listening on port ${port}...`));

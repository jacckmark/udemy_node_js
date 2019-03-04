function log(req, res, next) {
    console.log("Logging...");
    //next passes control to the next middleware function in the pipeline,
    //without next our request will be hanging (we will never get a response)
    next();
}

module.exports = log;
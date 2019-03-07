//promise is an object that holds eventual result of an asynhronous operation
//(value or an error), promise has three states: pending, fullfiled/rejected

//below we can also use array function
// const p = new Promise((resolve, reject)=>{
const p = new Promise(function(resolve, reject) {
    setTimeout(() => {
        //we use resolve to send a value (here 1) to the consumers of the
        //promise object
        resolve(1);
        //we are passing an error message object when something goes wrong
        //reject(new Error("message"));
    }, 2000);
});
p.then(result => console.log("Result1", result)).catch(err =>
    console.log("Error1", err.message)
);

/* ALREADY RESOLVED PROMISES */

//here we are creating already resolved promise (sometimes needed especially
//when we are writing unit tests)
const p2 = Promise.resolve({ id: 1 });
p2.then(result => console.log("Result2", result));

//same as above sometimes we need promise that is already rejected
const p3 = Promise.reject(new Error("reason of rejection..."));
p3.catch(error => console.log("Error2", error));
//this will result in printing stack trace (error objects include stack trace)
//so it might look like we did something wrong

/* PARALLEL PROMISES */

const p4 = new Promise((resolve, reject) => {
    setTimeout(() => {
        console.log("Async operation nr 1...");
        //if one of the promises gets rejected whole promise.all gets rejected
        //code in block catch will get executed
        //reject(new Error("because something went wrong..."));
        resolve(1);
    }, 2000);
});

const p5 = new Promise(resolve => {
    setTimeout(() => {
        console.log("Async operation nr 2...");
        resolve(2);
    }, 2000);
});

//this method will return new promise when all premises in passed array are
//resolved, p5 gets executed before we get a result from p4, but gets started
//after p5 (is passed as second in array)
Promise.all([p4, p5])
    .then(result => console.log("Result3", result)) //[1,2]
    .catch(error => console.log("Error3", error.message));

//race will result when one of the promises in array will be fulfilled, if it
//happens promise that is returned from race method will be considered fullfiled
Promise.race([p4, p5])
    .then(result => console.log("Result4", result)) //1
    .catch(error => console.log("Error4", error.message));

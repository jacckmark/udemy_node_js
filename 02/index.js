console.log("before");
//this is asynchronous function (will be executed in the future, 2seconds later)
//this function will be executed after 'before' and 'after'
setTimeout(() => {
    console.log("Reading a user from a database...");
}, 2000);
console.log("after");

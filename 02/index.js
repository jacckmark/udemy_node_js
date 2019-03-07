console.log("before(problem)");
//here we will get undefined because our function getUser will be executed and
//then immedietly scheduled for later (2s later) thats why when we are trying
//to read a value we get undefined
const user = getUser(1);
console.log(user);
console.log("after(problem)");

//this is asynchronous function (will be executed in the future, 2seconds later)
//this function will be executed after 'before' and 'after' console logs)
function getUser(id) {
    setTimeout(() => {
        //settimeout is a example of asynchronatous function, this function is
        //scheduling execution of its content for later and then immedietly
        //returns a control (in this example console logs before and after are
        //executed)
        console.log("Reading a user from a database(problem)...");
        return { id: id, gitHubUser: "julian" };
    }, 2000);
}

/* RESOLVING A PROBLEM WITH CALLBACK V1.0*/

//callback functions are good solution when we don't have a lot of functions
//because when we nest these it will be hard to write, read and to debug (we
//call it callback hell (simple solution is to not use anonymous functions))
console.log("before(callback1)");
//we can use here arrow function syntax instead of anonymous function
// getUser2(1, (user) => {
getUser2(1, function(user) {
    //here anonymous function passed as callback function
    console.log("User", user);
});
console.log("after(callback1)");

function getUser2(id, callback) {
    setTimeout(() => {
        console.log("Reading a user from a database(callback1)...");
        //when the result of the asynchronous function will be ready callback
        //function will be called
        callback({ id: id, gitHubUser: "julian" });
    }, 2000);
}

/* RESOLVING A PROBLEM WITH CALLBACK V2.0*/

//this is a simple example of a code which is hard to read (callback hell),
//belove we have a solution (we can use promises), but this code can be also
//written better (we can pass callbacks inside functions and this way we are
//not reapitig a code)
console.log("before(callback2)");
getUser3(1, user => {
    getRepositories(user.gitHubUser, repos => {
        getCommits(repos[0], commits => {
            console.log("Commits(callback2)", commits);
        });
    });
});
console.log("after(callback2)");

function getUser3(id, callback) {
    setTimeout(() => {
        console.log("Reading a user from a database(callback2)...");
        callback({ id: id, gitHubUser: "julian" });
    }, 2000);
}

function getRepositories(username, callback) {
    setTimeout(() => {
        console.log("Calling Github API(callback2)...");
        callback(["repo1", "repo2", "repo3"]);
    }, 2000);
}

function getCommits(repo, callback) {
    setTimeout(() => {
        console.log("Calling Github API(callback2)...");
        callback(["commit122", "commit123", "commit124", "commit125"]);
    }, 2000);
}

/* RESOLVING A PROBLEM WITH PROMISES */

console.log("Before(promise)");

getUser4(1)
    .then(user => getRepositories2(user.gitHubUser))
    .then(repos => getCommits2(repos[0]))
    .then(commits => console.log("Commits(promise)", commits))
    .catch(err => console.log("Error", err.message));

console.log("After(promise");

function getUser4(id) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log("Reading a user from a database(promise)...");
            resolve({ id: id, gitHubUser: "julian" });
        });
    });
}

function getRepositories2(username) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log("Calling Github API(promise)...");
            resolve(["repo1", "repo2", "repo3"]);
        });
    });
}

function getCommits2(repo) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log("Calling Github API(promise)...");
            resolve(["commit122", "commit123", "commit124", "commit125"]);
        }, 2000);
    });
}

/* RESOLVING A PROBLEM WITH ASYNC/AWAIT */

//this is just syntactic sugar our code will be runned using promises, but
//thanks to async and await it is easier to read (it looks synchronously)
console.log("Before(async/await)");

async function displayCommits() {
    try {
        //when js starts executing this line it will make thread available for
        //other work so next function will start executing and then another and
        //another
        const user = await getUser5(1);
        const repos = await getRepositories3(user.gitHubUser);
        const commits = await getCommits3(repos[0]);
        console.log("Commits(async/await)", commits);
        //in async/await we don't have catch so instead we should put whole
        //asynchronous code inside try catch block
    } catch (err) {
        console.log("Error", err.message);
    }
}
displayCommits();

console.log("After(async/await");

function getUser5(id) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log("Reading a user from a database(async/await)...");
            resolve({ id: id, gitHubUser: "julian" });
        }, 2000);
    });
}

function getRepositories3(username) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log("Calling Github API(async/await)...");
            resolve(["repo1", "repo2", "repo3"]);
        }, 2000);
    });
}

function getCommits3(repo) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log("Calling Github API(async/await)...");
            resolve(["commit122", "commit123", "commit124", "commit125"]);
        }, 2000);
    });
}

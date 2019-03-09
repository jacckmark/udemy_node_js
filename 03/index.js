const mongoose = require("mongoose");

//connect method returns a promise so we can use then and catch
mongoose
    .connect("mongodb://localhost/playground")
    .then(() => console.log("Connected to MongoDB..."))
    .catch(err => console.error("Could not connect to MongoDb...", err));

//type of properties used in mongoose schemas (String, Number, Date, Buffer,
//boolean, ObjectID (handy when connecting information from one table to another
//), Array)
const courseSchema = new mongoose.Schema({
    name: String,
    author: String,
    tags: [String],
    date: { type: Date, default: Date.now },
    isPublished: Boolean
});

//model takes 2 parameters (singular) name of our collection that this model
//is for and a schema defining a shape of documents in provided collection,
//const name is written with a capital letter because it is a class for
//creating objects of type Course
const Course = mongoose.model("Course", courseSchema);

async function createCourse() {
    //here we are creating a object of Course class, as a parameter we provide
    //all information required in schema
    const course = new Course({
        name: "Angular Course",
        author: "Marek Jarek",
        tags: ["angular", "javascript", "frontend"],
        isPublished: true
    });
    //method save saves information to a database, this method returns a promise
    //so we can await it and return a result
    const result = await course.save();
    console.log(result);
}

async function getCourses() {
    //find is like promise (we can await, catch and do then), and is used to
    //return objects from a collection, as a parameter we can provide properties
    //of Course object ({author:'Jan Kochanowski', isPublished: true})
    const courses = await Course.find()
        .limit(10) //how many documents will be returned
        .sort({ name: 1 }) //we want to sort by name in ascending order (-1 desc)
        .select({ name: 1, tags: 1 }); //we want to see in return only name, tags
    console.log(courses);
    //find gives us also a query operators which can be used to further filter
    //returned data: eq(equal), ne(not equal), gt(greater than), gte(grater than
    //or equal to), lt(less than), lte(less than or equal to), in (equal to
    //multiple values), nin(not in), usage examples:
    //.find({price: {$gte: 10, $lte:20}})  price>10 && price<20
    //.find({price: {$in: [10,15,25]}})  price=10 || price=15 || price=25
}

async function getCourses2() {
    //there are also logical query operators like: or, and
    const courses = await Course
        //to a find method we can also pass regex
        // .find(author: /Joe$/) //find all docs where author ends with Joe
        .find()
        //we get only documents that have author Marek Jarek or have isPublished
        //set to false
        .or([{ author: "Marek Jarek" }, { isPublished: false }])
        //and looks and works basicly the same (only difference is that all
        //conditions have to be met)
        .limit(10)
        .sort({ name: 1 })
        .select({ name: 1, tags: 1 });
    //there is also .count() method which is returning a number of documents
    console.log(courses);
}

async function getCourses3() {
    const pageNumber = 2;
    const pageSize = 10;
    const courses = await Course.find()
        //here we are doing some basic pagination (we are on page 2 and we are
        //skipping documents 1 to 10 so we see only page nr 2)
        .skip((pageNumber - 1) * pageSize)
        .limit(pageSize)
        .sort({ name: 1 })
        .select({ name: 1, tags: 1 });
    console.log(courses);
}

//this is example of query first approach, we use it when we need to check
//document before we update it (for example we don't want to change documents
//that have isPublished set to false)
async function updateCourse(id) {
    //finding a course by id (in mongo db it is field named '$oid')
    const course = await Course.findById(id);
    //if there is no such course in our db then exit the function
    if (!course) return;
    //if the course author is Marek we will not update it
    if (course.author == "Marek Jurek") return;
    course.isPublished = true;
    course.author = "Another Author";
    //change in our document can be made also with set method where we are
    //passing object of properties that we want to change, example below
    // course.set({
    //     isPublished: true,
    //     author: "Another Author"
    // });
    const result = await course.save();
    console.log(result);
}

//this approach is great when we don't need to check some prerequisites before
//updating or when we want to update a lot of documents at once
async function updateCourse2(id) {
    //update can also take parameters that will result in updating more than one
    //document (works like find)
    const result = await Course.update(
        { _id: id },
        {
            //there are a lot more mongo operators like $inc (increment value by
            //specified number) etc. they can be find in mongodb documentation
            $set: {
                author: "New Author",
                isPublished: false
            }
        }
    );
    console.log(result);
}

//method findByIdAndUpdate is usefull when we need to update document in the
//database without prerequisites and we want also to return it (regular update
//does not return changed document)
async function updateCourse3(id) {
    const course = await Course.findByIdAndUpdate(
        id,
        {
            $set: {
                author: "New Authorrr",
                isPublished: true
            }
        },
        //show me the new document (after update)
        { new: true }
    );
    console.log(course);
}

async function removeCourse(id) {
    //will find one document with given id and delete it (if will match more
    //then one only first one will be deleted), when we want to delete more than
    //one we need to use method deleteMany
    const result = await Course.deleteOne({ _id: id });
    //like with the update method when we want to remove document and return it
    //we need to use other method (findByIdAndRemove), implementation similar to
    //findByIdAndUpdate method
    console.log(result);
}

//createCourse();
//getCourses();
//getCourses2();
//getCourses3();
//updateCourse("5c83de8b8201361180d145e1");
//updateCourse2("5c83de8b8201361180d145e1");
//updateCourse3("5c83de8b8201361180d145e1");
removeCourse("5c83e7050106e030b0c35dac");

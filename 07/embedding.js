//relations in a mongo db with embedded documents (denormalization)
var ObjectId = require('mongodb').ObjectID;
//this approach is good when we don't have to do a lot of changes and don't
//have a lot of data, as for example author objects are going to be stored
//inside each object they will be needed, when we want to change e-mail address
//we will have to change it everywhere (there is no such problem in normalized
//mongodb database)
const mongoose = require("mongoose");

mongoose
    .connect("mongodb://localhost/playground2")
    .then(() => console.log("Connected to MongoDB..."))
    .catch(err => console.error("Could not connect to MongoDB...", err));

const authorSchema = new mongoose.Schema({
    name: String,
    bio: String,
    website: String
});

const Author = mongoose.model("Author", authorSchema);

const Course = mongoose.model(
    "Course",
    new mongoose.Schema({
        name: String,
        //in this approach we have to only set author property to an author
        //schema, we can also make author required works like always the only
        //difference is that we pass schema as a type of property
        // author: authorSchema

        //array of authors as document inside main course document
        authors: [authorSchema]
    })
);

async function createCourse(name, authors) {
    const course = new Course({
        name,
        authors
    });

    const result = await course.save();
    console.log(result);
}

async function listCourses() {
    const courses = await Course.find();
    console.log(courses);
}

//updating document embedded inside another document
async function updateAuthor(courseId) {
    //we can also use update method (update takes object)
    const course = await Course.findById(courseId);
    course.author.name = "Mosh Hamedani";
    course.save();
}

//adding one author to existing authors array (list of documents inside course
//document)
async function addAuthor(courseId, author) {
    const course = await Course.findById(courseId);
    course.authors.push(author);
    course.save();
}

//removing one author from author list inside document
async function removeAuthor(courseId, authorId) {
    const course = await Course.findById(courseId);
    const author = course.authors.id(authorId);
    author.remove();
    course.save();
}

//finding document where certain object is beeing embedded (here by objectId but
//it is possible to make such query for any property)
async function findEmbeddedDocument(authorId){
    const result = await Course.findOne({
        "authors._id":ObjectId(authorId)
        }
    );
    
    console.log(result.id);
}
//this is a way to create document with refrence (denormalization)
// createCourse('Node Course', new Author({ name: 'Mosh' }));
// updateAuthor("5c8e5c870842755b4b5af97f");

//creating course with array od ducuments inside
// createCourse("Node Course", [
//     new Author({ name: "Mark" }),
//     new Author({ name: "Manny" })
// ]);

// addAuthor("5c8e630376c02a78e0e5c447", new Author({ name: "Amy" }));

// removeAuthor("5c8e630376c02a78e0e5c447", "5c8e641302eb757ee79cdf24");
findEmbeddedDocument("5c8e630376c02a78e0e5c446");

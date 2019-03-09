const mongoose = require("mongoose");

mongoose
    .connect("mongodb://localhost/mongo-exercises")
    .then(() => console.log("Connected to MongoDB..."))
    .catch(err => console.error("Could not connect to MongoDb...", err));

const courseSchema = new mongoose.Schema({
    name: String,
    author: String,
    tags: [String],
    date: { type: Date, default: Date.now },
    isPublished: Boolean,
    price: Number
});

const Course = mongoose.model("Course", courseSchema);

async function createCourse() {
    const course = new Course({
        name: "Angular Course",
        author: "Marek Jarek",
        tags: ["angular", "javascript", "frontend"],
        isPublished: true
    });
    const result = await course.save();
    console.log(result);
}

async function getCourses() {
    const courses = await Course.find({ tags: "backend", isPublished: true })
        .sort({ name: 1 })
        .select({ name: 1, author: 1 });
    console.log(courses);
}

async function getCourses2() {
    const courses = await Course.find({
        tags: { $in: ["backend", "frontend"] },
        isPublished: true
    })
        .sort({ price: -1 })
        .select({ name: 1, author: 1 });
    console.log(courses);
}

async function getCourses3() {
    const courses = await Course.find({ isPublished: true })
        .or([{ price: { $gte: 15 } }, { name: /.*by.*/ }])
        .sort({ price: -1 })
        //other way to write what should be in the result
        .select("name author price");
    console.log(courses);
}

// getCourses();
// getCourses2();
getCourses3();


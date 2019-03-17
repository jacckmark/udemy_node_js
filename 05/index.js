const mongoose = require("mongoose");

mongoose
    .connect("mongodb://localhost/mongo-exercises")
    .then(() => console.log("Connected to MongoDB..."))
    .catch(err => console.error("Could not connect to MongoDb...", err));

const courseSchema = new mongoose.Schema({
    //name is right now required, has to be at least 5 character long, but not
    //longer than 255,  when we want to create an course document (we will get
    //unhandledPromiseException if we don't implement error handling for
    //situation when user does not met requirements)
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255
        //we can also use a regex on properties, with method 'match'
    },
    category: {
        type: String,
        required: true,
        //valid category should be equal to one of the provided values
        enum: ["web", "mobile", "network"],
        //before writing to a database the value will be converted to lowercase
        lowercase: true,
        //we also have uppercase method
        //trims any additional white spaces
        trim: true
    },
    author: String,
    //here we are implementing custom validation (provided type should be array)
    //containing at least one element, otherwise we will send message
    tags: {
        type: Array,
        validate: {
            validator: function(v) {
                return v && v.length > 0;
            },
            message: "A course should have at least one tag!"
        }
    },
    date: { type: Date, default: Date.now },
    isPublished: Boolean,
    //we cannot create course with isPublished property set to true, unless we
    //are providing a price
    price: {
        type: Number,
        required: function() {
            return this.isPublished;
        },
        //on numbers and dates we can throw error when provided number is to big
        //or small
        min: 10,
        max: 100,
        //custom getter(will change value when you are reading from database, it
        //will not change a value in database) and setter (will change price 
        //every time we will be trying to set this value)
        get: v => Math.round(v),
        set: v => Math.round(v)
    }
});

const Course = mongoose.model("Course", courseSchema);

async function createCourse() {
    const course = new Course({
        name: "Angular222",
        category: "WEB",
        author: "Marek Jarek",
        tags: ["web"],
        isPublished: true,
        price: 19.99
    });
    //here handling situation when provided object does not met requirements
    //for example one required value is missing (here name)
    try {
        const result = await course.save();
        console.log(result);
    } catch (ex) {
        console.log(ex.message);
        //we can see whole validation error by looping over ex.errors
        // for (field in ex.errors) console.log(ex.errors[field]);
    }
}

createCourse();

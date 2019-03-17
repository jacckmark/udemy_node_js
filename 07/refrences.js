//relations in a mongo db with refrences (normalization)

//is great when we are going to do a lot of changes to documents and we would 
//like to sync the changes across whole database, but is slow when doing queries
//because when we have relationship we do additional query for each relation in  
//a table
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/playground')
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.error('Could not connect to MongoDB...', err));

const Author = mongoose.model('Author', new mongoose.Schema({
  name: String,
  bio: String,
  website: String
}));

const Course = mongoose.model('Course', new mongoose.Schema({
  name: String,
  author:{
    //here setting author parameter to objectid and settting refrence so later
    //we can retrieve in one go (two request will be made but it will be looking
    //as it was one request only (look mongoDB normalization which basicly does
    //not exist)) not only course, but also author
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Author'
  }
}));

async function createAuthor(name, bio, website) { 
  const author = new Author({
    name, 
    bio, 
    website 
  });

  const result = await author.save();
  console.log(result);
}

async function createCourse(name, author) {
  const course = new Course({
    name, 
    author
  }); 
  
  const result = await course.save();
  console.log(result);
}

async function listCourses() { 
  const courses = await Course
    .find()
    //populate shows relation data when doing query so we won't get author id 
    //but additional query will be made and we will get course object with author
    //all fields included (unless we specify second parameter which is narrowing
    //a result (here we get name only and we are exluding from result author id))
    .populate('author', 'name -_id')
    //it also possible to get populated multiple fields in  our object (simply
    //call populate as many times as you need)
    .select('name author');
  console.log(courses);
}

// createAuthor('Mosh', 'My bio', 'My Website');

// createCourse('Node Course', '5c8e58f326d4ad466291ca77')

listCourses();
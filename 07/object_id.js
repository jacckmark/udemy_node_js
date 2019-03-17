const mongoose = require("mongoose");

let idsTable = [];
//objectids in mongodb contain information about time of creation, machine etc.
//so whe we pass an object id and for test try to change one number we will get
//an error so it is good practise to use generated ids (requests with ids that
//are written 'by hand' will result with neverending waiting for a response 
//(unhandled promise rejection))
for (let i = 0; i < 10; i++) {
    const id = new mongoose.Types.ObjectId();
    idsTable.push(id);
}
console.log(idsTable);
//returns a timestamp from retrieven id (thats why we don't need in mongodb 
//fields like createDate etc.)
console.log(idsTable[1].getTimestamp());

//check if id is valid
const isValid = mongoose.Types.ObjectId.isValid('12345');
console.log(isValid);

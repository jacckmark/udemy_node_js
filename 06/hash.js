const bcrypt = require("bcrypt");

async function run() {
    //salt is a part of random string added on the end or beggining of the
    //hashed password thus makes our hashed password more secure
    const salt = await bcrypt.genSalt(10);
    const hashPass = await bcrypt.hash("12344", salt);
    console.log(salt);
    console.log(hashPass);
}
run();

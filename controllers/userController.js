const bcrypt = require("bcryptjs");
const prisma = require('../script.js');


//Write credentials to users db
async function createUser(data) {
    const { userName, email, password, passwordConfirm } = data;

    if(password !== passwordConfirm){
        throw new Error("Passwords do not match");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const existing = await prisma.user.findUnique({ where: { email } });

    if(existing) {
        throw new Error("User already exists");
    }

    const user = await prisma.user.create({
        data: { username: userName, email, password: hashedPassword }
    });

    return user;
}


module.exports = {createUser};
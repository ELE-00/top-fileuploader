const  {Router} = require("express");
const userRouter = Router();

const {createUser} = require("../controllers/userController.js")

userRouter.get("/", (req,res) => {
    res.render("signup", {user: req.user})
})

//Sign up 
userRouter.post("/", async (req, res) =>{
    try{
        await createUser(req.body) 
        
        //login user
        res.redirect("/login")

    } catch (err) {
        console.log(err.message);
        res.status(400).send(err.message);
    }

})
module.exports = userRouter;
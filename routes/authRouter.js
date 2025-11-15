//authRouter.js
const passport = require("passport")
const  {Router} = require("express");
const authRouter = Router();

authRouter.get("/", (req,res) => {
    res.render("login", {user: req.user})
})

authRouter.post(
  "/",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/log-in"
  })
)

module.exports = authRouter;
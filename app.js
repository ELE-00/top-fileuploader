//app.js

const express = require("express")
const app = express();
const path = require("node:path")
const expressSession = require("express-session")
const { PrismaSessionStore } = require('@quixo3/prisma-session-store');
const { PrismaClient } = require('@prisma/client');
const passport = require("passport")
const initializePassport = require("./config/passport.js")
require("dotenv").config();

//Routers
const userRouter = require("./routes/userRouter.js")
const authRouter = require("./routes/authRouter.js")
const folderRouter = require("./routes/folderRouter.js")


// Middleware
app.use((req, res, next) => {
  res.locals.user = req.user || null;
  next();
});
app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));
app.use(
  expressSession({
    cookie: {
     maxAge: 7 * 24 * 60 * 60 * 1000 // ms
    },
    secret: 'eltopfileuploader',
    resave: false,
    saveUninitialized: false,
    store: new PrismaSessionStore(
      new PrismaClient(),
      {
        checkPeriod: 2 * 60 * 1000,  //ms
        dbRecordIdIsSessionId: true,
        dbRecordIdFunction: undefined,
      }
    )
  })
);

function ensureLoggedIn(req, res, next) {
    // Paths that should be public even when not logged in:
    const publicPaths = ["/login", "/signup"];

    if (!req.isAuthenticated() && !publicPaths.includes(req.path)) {
        return res.redirect("/login");
    }

    next();
}



// Initialize Passport
initializePassport(passport);
app.use(passport.initialize())
app.use(passport.session());


// Configure Express to use EJS as the templating engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

//Log-out
app.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});


//Config of endpoints
app.use("/login", authRouter);
app.use("/signup", userRouter);
app.use("/", ensureLoggedIn, folderRouter);



//Ports
const PORT = process.env.PORT || 8082;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))

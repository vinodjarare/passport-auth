const express = require("express");
const app = express();
const dotenv = require("dotenv").config();
const connectDb = require("./db");
const session = require("express-session");
const passport = require("passport");
const { connectPassport } = require("./passport.js");
const { isAuthenticated } = require("./middleware/auth");
const port = process.env.PORT || 4000;

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,

    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "none" : false,
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());
// app.use(passport.authenticate("session"));

// app.enable("trust proxy");

//connect database
connectDb();

connectPassport();

//routes
app.get("/", (req, res) => {
  res.send("hello world!");
  console.log(req.user);
});

app.post("/", isAuthenticated, (req, res) => {
  res.send("home");
});

app.get("/login", (req, res) => {
  res.send("login");
});

app.use("/api", require("./routes/userRoute"));

app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
});

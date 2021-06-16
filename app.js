if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const session = require("express-session");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const ejsmate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError");
const { campgroundSchema, reviewSchema } = require("./joischema");
const Review = require("./models/review");
// const dbUrl = process.env.DB_URL;
const dbUrl = process.env.DB_URL || "mongodb://localhost:27017/yelpcamp";

mongoose.connect(dbUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
});
const Campground = require("./models/campground");
const path = require("path");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");
const mongoSanitize = require("express-mongo-sanitize");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsmate);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.log("database connected");
});
const MongoDBStore = require("connect-mongo")(session);
const userRoutes = require("./routes/users");
const campgroundRoutes = require("./routes/campgrounds");
const reviewsRoutes = require("./routes/reviews");
const { initialize } = require("passport");
const { MongoStore } = require("connect-mongo");
const secret = process.env.SECRET || "goodsecret";

const store = new MongoDBStore({
  url: dbUrl,
  secret,
  touchAfter: 24 * 60 * 60,
});

store.on("error", function (e) {
  console.log("Session store error");
});

const sessionConfig = {
  store: store,
  name: "Orpheus",
  secret,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    // secure:true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};
// we set an expiration date for a cookie so that someone logged in doesn't stay logged in forever

app.use(session(sessionConfig));
app.use(flash());

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

app.get("/fakeUser", async (req, res) => {
  const user = new User({ email: "abcd@gmail.com", username: "bloopblaap" });
  const newUser = await User.register(user, "blaap");
  res.send(newUser);
});

app.use("/", userRoutes);
app.use("/campground", campgroundRoutes);
app.use("/campground/:id/reviews", reviewsRoutes);
app.use(mongoSanitize());

app.get("/", (req, res) => {
  res.render("home");
});

app.all("*", (req, res, next) => {
  next(new ExpressError("Page not found", 404));
});

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Oh no,something went wrong";
  res.status(statusCode).render("error", { err });
});
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`serving port ${port}`);
});

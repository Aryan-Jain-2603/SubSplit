require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
const ejsMate = require("ejs-mate");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const Sub = require("./models/sub.js");
const userController = require("./controllers/user.js");
const SubController = require("./controllers/plan.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const wrapAsync = require("./util/wrapAsync");
const { isLoggedIn, isOwner } = require("./middleware.js");
const ExpressError = require("./util/ExpressError.js");
const razorpay = require("./util/razorpay");

const store = MongoStore.create({
  mongoUrl: "mongodb://127.0.0.1:27017/SubSplitfinal",
  crypto: {
    secret: "secret",
  },
  touchAfter: 24 * 60 * 60,
});

const sessionOptions = {
  store: store,
  secret: "secret",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 3 * 24 * 60 * 60 * 1000,
    maxAge: 3 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

main()
  .then((res) => {
    console.log("connection established");
  })
  .catch((err) => console.log(err));

async function main() {
  const mongoURL = "mongodb://127.0.0.1:27017/SubSplitfinal";
  await mongoose.connect(mongoURL);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.engine("ejs", ejsMate);
app.use(methodOverride("_method"));

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

app.use(session(sessionOptions));
app.use(flash());
app.use(express.json());

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

app.get("/", (req, res) => {
  res.send("working");
});

app.get("/home", SubController.index);

app.post("/home", isLoggedIn, SubController.addPlan);

app.get("/search", wrapAsync(SubController.searchPlans));

app.get("/about", (req, res) => {
  res.render("./home/about.ejs");
})

app.get("/newsub", isLoggedIn, (req, res) => {
  res.render("./home/newsub.ejs");
});

app.get("/mysub", isLoggedIn, wrapAsync(SubController.MySubs));

app.get("/mysub/:id", isLoggedIn, wrapAsync(SubController.editForm));

app.put("/mysub/:id", isLoggedIn, isOwner, wrapAsync(SubController.updatePlan));

app.delete(
  "/mysub/:id",
  isLoggedIn,
  isOwner,
  wrapAsync(SubController.deletePlan)
);

app.get("/join/:id", isLoggedIn, wrapAsync(SubController.joinPlan));

app.get("/profile", isLoggedIn, async (req, res) => {
  let curUserId = req.user._id;
  let curUser = await User.findById(curUserId);
  res.render("./home/profile.ejs", { curUser, razorpayKeyId: process.env.RAZORPAY_KEY_ID });
});

app.get("/signup", (req, res) => {
  res.render("./users/signup.ejs");
});

app.post("/signup", wrapAsync(userController.signup));

app.post("/add-money", isLoggedIn, wrapAsync(userController.addMoney));

app.get("/login", (req, res) => {
  res.render("./users/login.ejs");
});

app.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  wrapAsync(userController.login)
);

app.get("/logout", userController.logout);

app.post("/create-order", async (req, res) => {
  const { amount } = req.body;

  if (!amount) {
    return res.status(400).json({ success: false, message: "Amount required" });
  }

  const options = {
    amount: parseInt(amount) * 100,
    currency: "INR",
    receipt: `receipt_order_${Date.now()}`
  };

  try {
    const order = await razorpay.orders.create(options);
    res.json({ success: true, order });
  } catch (err) {
    console.error("Razorpay Order Creation Error:", err);
    res.status(500).json({ success: false, message: "Order creation failed" });
  }
});




app.post("/update-wallet", async (req, res) => {
  const { amount } = req.body;

  if (!req.isAuthenticated()) {
    return res.status(401).json({ success: false, message: "Not logged in" });
  }

  try {
    const user = await User.findById(req.user._id);
    user.money = (user.money || 0) + parseInt(amount);
    await user.save();

    res.json({ success: true });
  } catch (err) {
    console.error("Failed to update wallet:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});



app.all("*", (req, res, next) => {
  next(new ExpressError(404, "page not found!"));
});

app.use((err, req, res, next) => {
  let { statuscode = 500, message = "unknown err occoured" } = err;
  res.status(statuscode).render("listings/err.ejs", { message });
});

app.listen(3000, (req, res) => {
  console.log("server is running");
});

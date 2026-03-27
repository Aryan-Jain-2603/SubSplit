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
const wrapAsync = require("./util/wrapAsync.js");
const { isLoggedIn, isOwner } = require("./middleware.js");
const ExpressError = require("./util/ExpressError.js");
const razorpay = require("./util/razorpay.js");
const { PythonShell } = require('python-shell');
const { expectsJson, sanitizeUser } = require("./util/http.js");

const cors = require('cors');

const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || "http://localhost:5173";

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
    sameSite: "lax",
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

async function handleCurrentUser(req, res) {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ user: null, message: "Not authenticated" });
  }

  const user = await User.findById(req.user._id);

  return res.json({
    user: sanitizeUser(user),
  });
}

async function handleCreateOrder(req, res) {
  const { amount } = req.body;

  if (!amount) {
    return res.status(400).json({ success: false, message: "Amount required" });
  }

  const options = {
    amount: parseInt(amount, 10) * 100,
    currency: "INR",
    receipt: `receipt_order_${Date.now()}`,
  };

  try {
    const order = await razorpay.orders.create(options);
    return res.json({ success: true, order });
  } catch (err) {
    console.error("Razorpay Order Creation Error:", err);
    return res.status(500).json({ success: false, message: "Order creation failed" });
  }
}

async function handleUpdateWallet(req, res) {
  const { amount } = req.body;

  if (!req.isAuthenticated()) {
    return res.status(401).json({ success: false, message: "Not logged in" });
  }

  try {
    const user = await User.findById(req.user._id);
    user.money = (user.money || 0) + parseInt(amount, 10);
    await user.save();

    return res.json({
      success: true,
      message: "Wallet updated successfully",
      user: sanitizeUser(user),
    });
  } catch (err) {
    console.error("Failed to update wallet:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}

async function handlePredict(req, res) {
  const { price, slots, type, categories } = req.body;
  const options = {
    mode: "json",
    pythonOptions: ["-u"],
    scriptPath: "./",
    args: [price, slots, type, categories],
  };

  try {
    const results = await PythonShell.run("predict_plan.py", options);
    return res.json(results[0]);
  } catch (err) {
    console.error("Prediction error:", err);
    return res.status(500).json({ error: "Prediction failed" });
  }
}

app.use(
  cors({
    origin: FRONTEND_ORIGIN,
    credentials: true,
  })
);

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
  res.locals.redirectURL = req.session.redirectURL;
  next();
});

app.get("/", (req, res) => {
  res.send("working");
});

app.get("/home", SubController.index);

app.get("/me", handleCurrentUser);
app.get("/api/auth/me", handleCurrentUser);

app.get("/api/config", (req, res) => {
  return res.json({
    razorpayKeyId: process.env.RAZORPAY_KEY_ID,
  });
});

app.get("/api/plans", wrapAsync(SubController.listJsonPlans));
app.get("/api/plans/:id", isLoggedIn, isOwner, wrapAsync(SubController.getJsonPlan));
app.post("/api/plans", isLoggedIn, wrapAsync(SubController.createJsonPlan));
app.put("/api/plans/:id", isLoggedIn, isOwner, wrapAsync(SubController.updateJsonPlan));
app.delete("/api/plans/:id", isLoggedIn, isOwner, wrapAsync(SubController.deleteJsonPlan));
app.post("/api/plans/:id/join", isLoggedIn, wrapAsync(SubController.joinJsonPlan));
app.get("/api/dashboard/subscriptions", isLoggedIn, wrapAsync(SubController.getDashboardJson));
app.get("/api/profile", isLoggedIn, async (req, res) => {
  const currentUser = await User.findById(req.user._id);

  return res.json({
    user: sanitizeUser(currentUser),
    razorpayKeyId: process.env.RAZORPAY_KEY_ID,
  });
});

app.post("/home", isLoggedIn, SubController.addPlan);

app.get("/search", wrapAsync(SubController.searchPlans));

app.get("/search1", wrapAsync(SubController.searchCatagories));


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
app.post("/api/auth/signup", wrapAsync(userController.signup));

app.post("/add-money", isLoggedIn, wrapAsync(userController.addMoney));

app.get("/login", (req, res) => {
  res.render("./users/login.ejs");
});

app.post(
  "/login",
  (req, res, next) => {
    passport.authenticate("local", (err, user, info = {}) => {
      if (err) {
        return next(err);
      }

      if (!user) {
        const message = info.message || "Invalid username or password";

        if (expectsJson(req)) {
          return res.status(401).json({ message });
        }

        req.flash("error", message);
        return res.redirect("/login");
      }

      req.logIn(user, (loginErr) => {
        if (loginErr) {
          return next(loginErr);
        }

        return userController.login(req, res, next);
      });
    })(req, res, next);
  }
);

app.post(
  "/api/auth/login",
  (req, res, next) => {
    passport.authenticate("local", (err, user, info = {}) => {
      if (err) {
        return next(err);
      }

      if (!user) {
        const message = info.message || "Invalid username or password";
        return res.status(401).json({ message });
      }

      req.logIn(user, (loginErr) => {
        if (loginErr) {
          return next(loginErr);
        }

        return userController.login(req, res, next);
      });
    })(req, res, next);
  }
);

app.get("/logout", userController.logout);
app.post("/logout", userController.logout);
app.post("/api/auth/logout", userController.logout);

app.post("/create-order", handleCreateOrder);
app.post("/api/payment/order", handleCreateOrder);

app.post("/update-wallet", handleUpdateWallet);
app.post("/api/wallet/top-up", handleUpdateWallet);

app.post("/predict", handlePredict);
app.post("/api/predict", handlePredict);



app.all("*", (req, res, next) => {
  next(new ExpressError(404, "page not found!"));
});

app.use((err, req, res, next) => {
  let { statuscode = 500, message = "unknown err occoured" } = err;
  if (expectsJson(req)) {
    return res.status(statuscode).json({ message });
  }

  res.status(statuscode).render("listings/err.ejs", { message });
});

app.listen(3000, (req, res) => {
  console.log("server is running");
});

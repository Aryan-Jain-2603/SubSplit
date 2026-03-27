const User = require("../models/user");
const { expectsJson, sanitizeUser } = require("../util/http");

module.exports.signup = async (req, res) => {
  try {
    let { username, email, password } = req.body;
    let createdUser = new User({ email, username });
    let result = await User.register(createdUser, password);
    req.login(result, (err) => {
      if (err) {
        if (expectsJson(req)) {
          return res.status(500).json({ message: "Failed to create session" });
        }

        return res.redirect("/signup");
      }

      const message = "You have been logged in successfully";

      if (expectsJson(req)) {
        req.session.redirectURL = undefined;
        return res.status(201).json({
          message,
          user: sanitizeUser(result),
        });
      }

      req.flash("success", message);
      return res.redirect("/home");
    });
  } catch (err) {
    if (expectsJson(req)) {
      return res.status(400).json({ message: err.message });
    }

    req.flash("error", err.message);
    return res.redirect("/signup");
  }
};

module.exports.login = async (req, res) => {
  const message = "Welcome back. Login successful";

  if (expectsJson(req)) {
    req.session.redirectURL = undefined;
    return res.json({
      message,
      user: sanitizeUser(req.user),
    });
  }

  req.flash("success", message);
  if (!res.locals.redirectURL) {
    return res.redirect("/home");
  }

  const redirectURL = res.locals.redirectURL;
  req.session.redirectURL = undefined;

  return res.redirect(redirectURL);
};

module.exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }

    req.session.redirectURL = undefined;

    const message = "You have been logged out successfully";

    if (expectsJson(req)) {
      return res.json({ message });
    }

    req.flash("success", message);
    return res.redirect("/home");
  });
};

module.exports.addMoney = async (req, res) => {
  const { amount } = req.body;
  if (!amount || amount <= 0) {
    req.flash("error", "Invalid amount entered!");
    return res.redirect("/profile");
  }

  const user = await User.findById(req.user._id);
  user.money += parseInt(amount);
  await user.save();

  req.flash("success", `₹${amount} added to your wallet!`);
  res.redirect("/profile");
};

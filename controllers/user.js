const User = require("../models/user");
module.exports.signup = async (req, res) => {
  try {
    let { username, email, password } = req.body;
    let createdUser = new User({ email, username });
    let result = await User.register(createdUser, password);
    req.login(result, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", "You have been logged In successfully");
      res.redirect("/home");
    });
  } catch (err) {
    req.flash("error", err.message);
    res.redirect("/signup");
  }
};

module.exports.login = async (req, res) => {
  req.flash("success", "Welcome back User, Login successful");
  if (!res.locals.redirectURL) {
    res.redirect("/home");
    return;
  }
  res.redirect(res.locals.redirectURL);
};

module.exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "You have been logged out successfully");
    res.redirect("/home");
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

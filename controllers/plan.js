const Sub = require("../models/sub.js");
const User = require("../models/user.js");

module.exports.index = async (req, res) => {
  try {
    let plans = await Sub.find().populate("owner", "username");

    if (req.isAuthenticated()) {
      const user = await User.findById(req.user._id).populate("subscriptions");
      const joinedPlansIDs = user.subscriptions.map((sub) =>
        sub._id.toString()
      );

      plans = plans.filter(
        (plan) => !joinedPlansIDs.includes(plan._id.toString())
      );
    }

    res.render("./home/index.ejs", { plans ,currUser: req.user, razorpayKeyId: process.env.RAZORPAY_KEY_ID});
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

module.exports.addPlan = async (req, res) => {
  try {
    const newPlan = new Sub(req.body.sub);
    newPlan.owner = req.user._id;
    let result = await newPlan.save();

    let Owner = await User.findById(req.user._id);
    Owner.listings.push(result._id);
    await Owner.save();

    req.flash("success", "Plan added successfully!");
    res.redirect("/home");
  } catch (err) {
    req.flash("error", "Failed to add plan.");
    console.error(err);
    res.redirect("/newsub");
  }
};

module.exports.deletePlan = async (req, res) => {
  try {
    let { id } = req.params;

    let plan = await Sub.findByIdAndDelete(id);
    if (!plan) {
      req.flash("error", "Plan not found");
      return res.redirect("/home");
    }

    await User.findByIdAndUpdate(req.user._id, { $pull: { listings: id } });

    req.flash("success", "Plan deleted successfully");
    res.redirect("/home");
  } catch (err) {
    console.error(err);
    req.flash("error", "Something went wrong");
    res.redirect("/home");
  }
};

module.exports.MySubs = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate({
        path: "listings",
        populate: { path: "owner" }
      })
      .populate("subscriptions");

    const myPlans = user.listings;        
    const joinedPlans = user.subscriptions; 

    res.render("./home/mysub.ejs", { myPlans, joinedPlans });
  } catch (err) {
    req.flash("error", "Could not fetch your subscriptions.");
    res.redirect("/home");
  }
};


module.exports.editForm = async (req, res) => {
  let { id } = req.params;
  let plan = await Sub.findById(id);
  res.render("./home/edit.ejs", { plan });
};

module.exports.updatePlan = async (req, res) => {
  let { id } = req.params;
  let plan = await Sub.findById(id);
  if (!plan) {
    return res.status(404).send("plan not found");
  }
  Object.assign(plan, req.body.plan);
  await plan.save();
  res.redirect("/mysub");
};

module.exports.searchPlans = async (req, res) => {
  const { query } = req.query;
  // console.log(req.query);

  if (!query) {
    req.flash("error", "Please enter a search term.");
    return res.redirect("/home");
  }

  const searchQuery = query.toLowerCase();

  const allPlans = await Sub.find();

  const plans = allPlans.filter(
    (plan) =>
      plan.name.toLowerCase().includes(searchQuery) ||
      plan.type.toLowerCase().includes(searchQuery)
  );

  if (plans.length === 0) {
    req.flash("error", "No Plans found for this search.");
    return res.redirect("/home");
  }

  res.render("home/index", { plans: plans, razorpayKeyId: process.env.RAZORPAY_KEY_ID });
};

module.exports.searchCatagories = async (req, res) => {
  const { catagorie } = req.query;

  if (!catagorie) {
    req.flash("error", "Please enter a search term.");
    return res.redirect("/home");
  }

  const searchQuery = catagorie.toLowerCase(); // optional: normalize for case-insensitive search
  const allPlans = await Sub.find();

  const plans = allPlans.filter((plan) => 
    plan.categories && plan.categories.toLowerCase() === searchQuery
  );

  if (plans.length === 0) {
    req.flash("error", "No Plans found for this search.");
    return res.redirect("/home");
  }

  res.render("home/index", {
    plans: plans,
    razorpayKeyId: process.env.RAZORPAY_KEY_ID,
  });
};

module.exports.joinPlan = async (req, res) => {
  let { id } = req.params;
  let plan = await Sub.findById(id).populate("owner");

  if (!plan) {
    req.flash("error", "Plan not found");
    return res.redirect("/home");
  }

  if (plan.owner._id.equals(req.user._id)) {
    req.flash("error", "You are the owner of this plan!");
    return res.redirect("/home");
  }

  if (plan.slots < 1) {
    req.flash("error", "No more slots left to join ");
    return res.redirect("/home");
  }

  let user = await User.findById(req.user._id);
  if (user.money < plan.price) {
    req.flash("error", "Insufficient balance in your wallet!");
    return res.redirect("/home");
  }

  plan.slots -= 1;
  await plan.save();

  user.money -= plan.price;

  let owner = await User.findById(plan.owner._id);
  owner.money += plan.price;

  await user.save();
  await owner.save();

  user.subscriptions.push(plan._id);
  await user.save();

  req.flash("success", "Successfully joined the plan!");
  res.redirect("/home");
};

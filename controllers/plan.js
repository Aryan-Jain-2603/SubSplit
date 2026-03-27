const Sub = require("../models/sub.js");
const User = require("../models/user.js");
const { sanitizePlan } = require("../util/http.js");

const PLAN_FIELDS = [
  "name",
  "description",
  "type",
  "price",
  "slots",
  "expDate",
  "image",
  "categories",
  "email",
  "password",
];

function buildPlanPayload(body = {}) {
  const payload = {};

  for (const field of PLAN_FIELDS) {
    if (body[field] !== undefined) {
      payload[field] = body[field];
    }
  }

  if (payload.price !== undefined) {
    payload.price = Number(payload.price);
  }

  if (payload.slots !== undefined) {
    payload.slots = Number(payload.slots);
  }

  if (typeof payload.image === "string" && payload.image.trim() === "") {
    delete payload.image;
  }

  return payload;
}

async function getJoinedPlanIds(userId) {
  if (!userId) {
    return new Set();
  }

  const user = await User.findById(userId).populate("subscriptions");
  return new Set(user.subscriptions.map((sub) => sub._id.toString()));
}

async function getBrowsePlans({ userId, query, category, type, availability }) {
  let plans = await Sub.find().populate("owner", "username email");

  if (userId) {
    const joinedPlanIds = await getJoinedPlanIds(userId);
    plans = plans.filter((plan) => !joinedPlanIds.has(plan._id.toString()));
  }

  const normalizedQuery = query?.trim().toLowerCase();
  const normalizedCategory = category?.trim().toLowerCase();
  const normalizedType = type?.trim().toLowerCase();

  return plans.filter((plan) => {
    const matchesQuery =
      !normalizedQuery ||
      [plan.name, plan.type, plan.description, plan.categories]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(normalizedQuery));

    const matchesCategory =
      !normalizedCategory ||
      plan.categories?.toLowerCase() === normalizedCategory;

    const matchesType =
      !normalizedType ||
      plan.type?.toLowerCase() === normalizedType;

    const matchesAvailability =
      availability !== "open" || Number(plan.slots) > 0;

    return matchesQuery && matchesCategory && matchesType && matchesAvailability;
  });
}

async function getDashboardPayload(userId) {
  const user = await User.findById(userId)
    .populate({
      path: "listings",
      populate: { path: "owner", select: "username email" },
    })
    .populate({
      path: "subscriptions",
      populate: { path: "owner", select: "username email" },
    });

  return {
    user,
    hostedPlans: user.listings,
    joinedPlans: user.subscriptions,
  };
}

module.exports.index = async (req, res) => {
  try {
    let plans = await getBrowsePlans({ userId: req.user?._id });

    res.render("./home/index.ejs", {
      plans,
      currUser: req.user,
      razorpayKeyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

module.exports.addPlan = async (req, res) => {
  try {
    const newPlan = new Sub(req.body.sub);
    newPlan.owner = req.user._id;
    const result = await newPlan.save();

    const owner = await User.findById(req.user._id);
    owner.listings.push(result._id);
    await owner.save();

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
    const { id } = req.params;

    const plan = await Sub.findByIdAndDelete(id);
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
    const { hostedPlans, joinedPlans } = await getDashboardPayload(req.user._id);
    res.render("./home/mysub.ejs", { myPlans: hostedPlans, joinedPlans });
  } catch (err) {
    req.flash("error", "Could not fetch your subscriptions.");
    res.redirect("/home");
  }
};

module.exports.editForm = async (req, res) => {
  const { id } = req.params;
  const plan = await Sub.findById(id);
  res.render("./home/edit.ejs", { plan });
};

module.exports.updatePlan = async (req, res) => {
  const { id } = req.params;
  const plan = await Sub.findById(id);
  if (!plan) {
    return res.status(404).send("plan not found");
  }

  Object.assign(plan, req.body.plan);
  await plan.save();
  res.redirect("/mysub");
};

module.exports.searchPlans = async (req, res) => {
  const { query } = req.query;

  if (!query) {
    req.flash("error", "Please enter a search term.");
    return res.redirect("/home");
  }

  const plans = await getBrowsePlans({ userId: req.user?._id, query });

  if (plans.length === 0) {
    req.flash("error", "No Plans found for this search.");
    return res.redirect("/home");
  }

  res.render("home/index", {
    plans,
    razorpayKeyId: process.env.RAZORPAY_KEY_ID,
    currUser: req.user,
  });
};

module.exports.searchCatagories = async (req, res) => {
  const { catagorie } = req.query;

  if (!catagorie) {
    req.flash("error", "Please enter a search term.");
    return res.redirect("/home");
  }

  const plans = await getBrowsePlans({
    userId: req.user?._id,
    category: catagorie,
  });

  if (plans.length === 0) {
    req.flash("error", "No Plans found for this search.");
    return res.redirect("/home");
  }

  res.render("home/index", {
    plans,
    razorpayKeyId: process.env.RAZORPAY_KEY_ID,
    currUser: req.user,
  });
};

module.exports.joinPlan = async (req, res) => {
  const { id } = req.params;
  const plan = await Sub.findById(id).populate("owner");

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

  const user = await User.findById(req.user._id);
  if (user.money < plan.price) {
    req.flash("error", "Insufficient balance in your wallet!");
    return res.redirect("/home");
  }

  plan.slots -= 1;
  await plan.save();

  user.money -= plan.price;

  const owner = await User.findById(plan.owner._id);
  owner.money += plan.price;

  await user.save();
  await owner.save();

  user.subscriptions.push(plan._id);
  await user.save();

  req.flash("success", "Successfully joined the plan!");
  res.redirect("/home");
};

module.exports.listJsonPlans = async (req, res) => {
  const plans = await getBrowsePlans({
    userId: req.user?._id,
    query: req.query.query,
    category: req.query.category,
    type: req.query.type,
    availability: req.query.availability,
  });

  return res.json({
    plans: plans.map((plan) =>
      sanitizePlan(plan, { currentUserId: req.user?._id }),
    ),
  });
};

module.exports.getJsonPlan = async (req, res) => {
  const plan = await Sub.findById(req.params.id).populate("owner", "username email");

  if (!plan) {
    return res.status(404).json({ message: "Plan not found" });
  }

  return res.json({
    plan: sanitizePlan(plan, {
      currentUserId: req.user?._id,
      includeCredentials: true,
    }),
  });
};

module.exports.createJsonPlan = async (req, res) => {
  const plan = new Sub(buildPlanPayload(req.body));
  plan.owner = req.user._id;

  const result = await plan.save();
  await User.findByIdAndUpdate(req.user._id, {
    $push: { listings: result._id },
  });

  const populatedPlan = await Sub.findById(result._id).populate("owner", "username email");

  return res.status(201).json({
    message: "Plan added successfully!",
    plan: sanitizePlan(populatedPlan, {
      currentUserId: req.user._id,
      includeCredentials: true,
    }),
  });
};

module.exports.updateJsonPlan = async (req, res) => {
  const plan = await Sub.findById(req.params.id).populate("owner", "username email");

  if (!plan) {
    return res.status(404).json({ message: "Plan not found" });
  }

  Object.assign(plan, buildPlanPayload(req.body));
  await plan.save();

  return res.json({
    message: "Plan updated successfully",
    plan: sanitizePlan(plan, {
      currentUserId: req.user._id,
      includeCredentials: true,
    }),
  });
};

module.exports.deleteJsonPlan = async (req, res) => {
  const plan = await Sub.findByIdAndDelete(req.params.id);

  if (!plan) {
    return res.status(404).json({ message: "Plan not found" });
  }

  await User.findByIdAndUpdate(req.user._id, { $pull: { listings: req.params.id } });

  return res.json({ message: "Plan deleted successfully" });
};

module.exports.getDashboardJson = async (req, res) => {
  const { user, hostedPlans, joinedPlans } = await getDashboardPayload(req.user._id);

  return res.json({
    hostedPlans: hostedPlans.map((plan) =>
      sanitizePlan(plan, {
        currentUserId: req.user._id,
        includeCredentials: true,
      }),
    ),
    joinedPlans: joinedPlans.map((plan) =>
      sanitizePlan(plan, {
        currentUserId: req.user._id,
        includeCredentials: true,
      }),
    ),
    summary: {
      hostedCount: hostedPlans.length,
      joinedCount: joinedPlans.length,
      walletBalance: user.money,
    },
  });
};

module.exports.joinJsonPlan = async (req, res) => {
  const plan = await Sub.findById(req.params.id).populate("owner", "username email");

  if (!plan) {
    return res.status(404).json({ message: "Plan not found" });
  }

  if (plan.owner._id.equals(req.user._id)) {
    return res.status(400).json({ message: "You are the owner of this plan" });
  }

  if (plan.slots < 1) {
    return res.status(400).json({ message: "No more slots left to join" });
  }

  const user = await User.findById(req.user._id);

  if (user.subscriptions.some((subscriptionId) => subscriptionId.equals(plan._id))) {
    return res.status(400).json({ message: "You already joined this plan" });
  }

  if (user.money < plan.price) {
    return res.status(400).json({ message: "Insufficient balance in your wallet" });
  }

  plan.slots -= 1;
  await plan.save();

  user.money -= plan.price;
  user.subscriptions.push(plan._id);

  const owner = await User.findById(plan.owner._id);
  owner.money += plan.price;

  await user.save();
  await owner.save();

  return res.json({
    message: "Successfully joined the plan!",
    plan: sanitizePlan(plan, {
      currentUserId: req.user._id,
    }),
  });
};

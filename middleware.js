// const Listing = require("./models/listing");
// const ExpressError = require("./util/ExpressError.js");
// const { listingSchema, reviewSchema } = require("./schema.js");
// const Review = require("./models/review.js");
const Sub = require("./models/sub.js");
const { expectsJson } = require("./util/http.js");

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectURL = req.originalUrl;
    const message = "You must be logged in to continue";

    if (expectsJson(req)) {
      return res.status(401).json({ message });
    }

    req.flash("error", message);
    return res.redirect("/login");
  }
  next();
};

// module.exports.saveRedirectURL = (req, res, next) => {
//   if (req.session.redirectURL) {
//     res.locals.redirectURL = req.session.redirectURL;
//   }
//   next();
// };

module.exports.isOwner = async (req, res, next) => {
  let { id } = req.params;
  let listing = await Sub.findById(id);
  if (!listing) {
    if (expectsJson(req)) {
      return res.status(404).json({ message: "Plan not found" });
    }

    req.flash("error", "Plan not found");
    return res.redirect("/mysub");
  }

  if (!listing.owner._id.equals(res.locals.currUser._id)) {
    const message = "You do not have access to edit this listing";

    if (expectsJson(req)) {
      return res.status(403).json({ message });
    }

    req.flash("error", message);
    return res.redirect(`/mysub/${id}`);
  }
  next();
};

// module.exports.isReviewOwner = async (req, res, next) => {
//     let { id, reviewid } = req.params;
//     let review = await Review.findById(reviewid);
//     if (!review.author._id.equals(res.locals.currUser._id)) {
//       req.flash("error", "you dont have access to edit this Lisitng");
//       return res.redirect(`/listings/${id}`);
//     }
//     next();
//   };

// module.exports.validateLsiting = (req, res, next) => {
//   let {error} = listingSchema.validate(req.body);
//   if (error) {
//     let errMsg = error.details.map((el) => el.message).join(",");
//     throw new ExpressError(400, errMsg);
//   }else{
//     next()
//   }
// };

// module.exports.validateReview = (req, res, next) => {
//   let { error } = reviewSchema.validate(req.body);
//   if (error) {
//     let errMsg = error.details.map((el) => el.message).join(",");
//     throw new ExpressError(400, errMsg);
//   } else {
//     next();
//   }
// };

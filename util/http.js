function expectsJson(req) {
  const acceptHeader = req.get("accept") || "";
  const requestedWith = req.get("x-requested-with") || "";

  return (
    req.xhr ||
    requestedWith.toLowerCase() === "xmlhttprequest" ||
    acceptHeader.includes("application/json")
  );
}

function sanitizeUser(user) {
  if (!user) {
    return null;
  }

  return {
    _id: user._id,
    username: user.username,
    email: user.email,
    money: user.money,
    listingsCount: Array.isArray(user.listings) ? user.listings.length : undefined,
    subscriptionsCount: Array.isArray(user.subscriptions)
      ? user.subscriptions.length
      : undefined,
  };
}

function sanitizeOwner(owner) {
  if (!owner) {
    return null;
  }

  return {
    _id: owner._id,
    username: owner.username,
    email: owner.email,
  };
}

function sanitizePlan(plan, options = {}) {
  if (!plan) {
    return null;
  }

  const { includeCredentials = false, currentUserId = null } = options;
  const ownerId = plan.owner && plan.owner._id ? plan.owner._id.toString() : plan.owner?.toString?.();
  const viewerId = currentUserId ? currentUserId.toString() : null;

  return {
    _id: plan._id,
    name: plan.name,
    description: plan.description,
    type: plan.type,
    categories: plan.categories,
    price: plan.price,
    slots: plan.slots,
    expDate: plan.expDate,
    image: plan.image,
    owner: sanitizeOwner(plan.owner),
    isOwner: Boolean(viewerId && ownerId && viewerId === ownerId),
    email: includeCredentials ? plan.email : undefined,
    password: includeCredentials ? plan.password : undefined,
  };
}

module.exports = {
  expectsJson,
  sanitizePlan,
  sanitizeUser,
};

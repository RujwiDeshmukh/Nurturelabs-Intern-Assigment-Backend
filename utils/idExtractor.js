const User = require("../models/User");
const Advisor = require("../models/advisor");
exports.getUserById = (req, res, next, id) => {
  // look for the user in the database
  User.findById({ _id: id }).exec((err, user) => {
    // if err or user is not found return 400
    if (err || !user) {
      return res.sendStatus(400);
    }
    // if user exists put the user into req.profile
    req.profile = user;
    // finally move to the next
    next();
  });
};

exports.getAdvisorById = (req, res, next, id) => {
  console.log(id);
  // look for the user in the database
  Advisor.findById({ _id: id }).exec((err, advisor) => {
    // if err or user is not found return 400
    if (err || !advisor) {
      return res.sendStatus(400);
    }
    // if user exists put the user into req.profile
    req.advisor_profile = advisor;
    // finally move to the next
    next();
  });
};

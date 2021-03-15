const router = require("express").Router();
const jwt = require("jsonwebtoken");
const expressjwt = require("express-jwt");
const { validateUserInputLogin } = require("../utils/validateInput");
const { getUserById, getAdvisorById } = require("../utils/idExtractor");

const User = require("../models/User");
const Advisor = require("../models/advisor");
const Booking = require("../models/Booking");

// middleware for verifying usedId and put user in req object
// can be used later to verify the user loggedin
router.param("userId", getUserById);
router.param("advisorId", getAdvisorById);

// to verify jwt commenting since it's not specified in task that wheater to protect rourtes or not
// router.use(
//   expressjwt({
//     secret: process.env.JWT_SECRET,
//     userProperty: "auth",
//     algorithms: ["HS256"],
//   })
// );

/**
 * @method POST
 * @description login method
 */

router.post("/login", async (req, res) => {
  const data = req.body;
  if (!validateUserInputLogin(data)) {
    return res.sendStatus(400);
  }
  try {
    const user = await User.findOne({ email: data.email });
    if (!user) {
      return res.sendStatus(401);
    }
    if (!user.authenticate(data.password)) {
      return res.sendStatus(401);
    }
    // sign the jwt
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    return res.status(200).json({ token: token, user_id: user.id });
  } catch (error) {
    console.log(error);
  }
  return res.sendStatus(500);
});

/**
 * @method POST
 * @description register method
 */

router.post("/register", async (req, res) => {
  const data = req.body;
  try {
    if (!data.name || !data.email || !data.password) {
      return res.sendStatus(400);
    }
    let newuser = new User(data);
    newuser = await newuser.save();
    const token = jwt.sign({ id: newuser.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    return res.status(200).json({ token: token, user_id: newuser.id });
  } catch (error) {
    console.log(error);
  }
  return res.sendStatus(500);
});

/**
 * @method get
 * @description method to get all the advisors from db
 */
router.get("/:userId/advisor", async (req, res) => {
  try {
    const advisors = await Advisor.find({});
    return res.status(200).json({ advisors });
  } catch (error) {
    console.log(error);
  }
  return res.sendStatus(500);
});

/**
 * @method post
 * @description method to can a book a call
 */

router.post("/:userId/advisor/:advisorId", async (req, res) => {
  try {
    // create new Booking
    let newbooking = new Booking({
      advisor: req.advisor_profile._id,
      bookingTime: req.body.bookingTime,
    });
    newbooking = await newbooking.save();
    if (!newbooking) {
      return res.sendStatus(500);
    }
    // put the booking into users booking list
    let user = await User.findOneAndUpdate(
      { _id: req.profile._id },
      {
        $push: { bookings: newbooking.id },
      },
      {
        new: true,
        upsert: true,
      }
    );
    console.log(user);
    if (!user) {
      return res.sendStatus(500);
    }
    return res.sendStatus(200);
  } catch (error) {
    console.log(error);
  }
  return res.sendStatus(500);
});

/**
 * @method get
 * @description get all bookings made by the user
 */
router.get("/:userId/advisor/booking", async (req, res) => {
  try {
    const user = await User.findById(req.profile._id).populate({
      path: "bookings",
      populate: { path: "advisor" },
    });
    if (!user) {
      return res.sendStatus(400);
    }
    return res.status(200).json({ bookings: user.bookings });
  } catch (error) {}
  return res.status(200).send("List of bookings");
});

module.exports = router;

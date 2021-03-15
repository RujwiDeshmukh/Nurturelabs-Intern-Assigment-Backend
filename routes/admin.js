const { validateAdvisorRegister } = require("../utils/validateInput");
const Advisor = require("../models/advisor");
const router = require("express").Router();

/**
 * @method post
 * @description method to add new advisor
 */

router.post("/advisor", async (req, res) => {
  const data = req.body;
  if (!validateAdvisorRegister(data)) {
    return res.sendStatus(400);
  }
  try {
    let newadvisor = new Advisor(data);
    newadvisor = await newadvisor.save();
    return res.sendStatus(200);
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;

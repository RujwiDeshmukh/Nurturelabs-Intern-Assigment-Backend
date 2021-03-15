const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    advisor: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Advisor",
    },
    bookingTime: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);

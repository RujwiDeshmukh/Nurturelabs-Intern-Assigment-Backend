const mongoose = require("mongoose");
const crypto = require("crypto");
const { v4: uuidv4 } = require("uuid");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      maxlength: 32,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },

    // TODO: CoMe BaCk here this is critical
    enc_password: {
      type: String,
      required: true,
    },
    // ! SALT is very important 😁
    salt: String,
    bookings: [
      {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Booking",
      },
    ],
  },
  { timestamps: true }
);

// ? Virutuals for schema  to encrypt the password
userSchema
  .virtual("password")
  .set(function (password) {
    this._password = password;
    this.salt = uuidv4();
    this.enc_password = this.securePassword(password);
  })
  .get(function () {
    return this._password;
  });

// ? schema methods
userSchema.methods = {
  authenticate: function (plainPassword) {
    return this.securePassword(plainPassword) === this.enc_password;
  },
  securePassword: function (plainPassword) {
    if (!plainPassword) {
      return "";
    }
    try {
      return crypto
        .createHmac("sha256", this.salt)
        .update(plainPassword)
        .digest("hex");
    } catch (err) {
      return "";
    }
  },
};

module.exports = mongoose.model("User", userSchema);

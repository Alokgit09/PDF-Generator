const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const SECRET_KEY = process.env.JWT_SECRET_KEY;

const userSchema = new mongoose.Schema(
  {
    register_id: {
      type: Number,
      require: true,
    },
    name: {
      type: String,
      require: true,
    },
    token: {
      type: String,
      require: true,
    },
  },
  { timestamps: true }
);

userSchema.methods.generateAuthToken = async function () {
  try {
    const token = jwt.sign(
      {
        register_id: this.register_id,
        name: this.name,
        iat: Math.floor(Date.now() / 1000) + 60 * 60 * 24,
      },
      SECRET_KEY,
      {
        expiresIn: "1d",
      }
    );
    this.token = token;
    await this.save();
    return token;
  } catch (err) {
    console.log("Schema Token err>>", err);
    res.json({ message: "Schema Token err>>>>", err });
  }
};

const userdataSchema = new mongoose.model("Userdata", userSchema);

module.exports = userdataSchema;

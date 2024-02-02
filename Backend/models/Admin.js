const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const validator = require("validator");
const bcrypt = require("bcrypt");


const SECRET_KEY = process.env.JWT_SECRET_KEY;

const adminSchema = new mongoose.Schema(
    {
        firstname: {
            type: 'string',
            required: true,
        },
        lastname: {
            type: 'string',
            required: true,
        },
        email: {
            type: String,
            require: true,
            unique: [true, "E-mail is already here"],
            validate(value) {
                if (!validator.isEmail(value)) {
                    throw new Error("Invalid E-mail");
                }
            },
        },
        password: {
            type: String,
            require: true,
            min: 6,
        },
        mobile: {
            type: 'Number',
            required: true,
            min: 10,
            unique: true,
        },
        address: {
            type: 'string',
            required: true,
        },
        token: {
            type: String,
            require: true,
        },

    });


adminSchema.methods.GenerateAuthToken = async function () {
    try {
        const token = jwt.sign(
            {
                email: this.email,
                id: this.id,
                lat: Math.floor(Date.now() / 1000) + 60 * 60 * 24,
            },
            SECRET_KEY, {
            expiresIn: '1d',
        }
        );
        this.token = token;
        await this.save();
        return token;

    } catch (err) {
        console.log("token error part" + err);
    };
};


adminSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 10);
        next();
    }
});


const AdminModel = mongoose.model('Admindata', adminSchema);

module.exports = AdminModel;
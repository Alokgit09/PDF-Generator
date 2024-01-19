const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const SECRET_KEY = process.env.JWT_SECRET_KEY;

const pdfUserdata = new mongoose.Schema({
    register_id: {
        type: Number,
        require: true,
    },
    pdfPath: {
        type: String,
        require: true,
    },
});


const pdfDataschema = new mongoose.model("PdfData", pdfUserdata);

module.exports = pdfDataschema;
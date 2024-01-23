const express = require("express");
const UserData = require("../models/Userdata");
const PdfData = require("../models/Pdfpathdata");

const FilteridName = async (req, res) => {
    try {
        const query = req.query;
        console.log('findData>>', query);
    } catch (err) {
        console.log("FilteridName>>", err);
    }
};

module.exports = FilteridName;
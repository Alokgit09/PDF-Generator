const express = require("express");
const UserData = require("../models/Userdata");
const PdfData = require("../models/Pdfpathdata");


const CandinetlistAdmin = async (req, res) => {
    try {
        const findAllcandidates = await UserData.find();
        res.status(201).json(findAllcandidates)
    } catch (err) {
        console.log(err);
    }

};

module.exports = CandinetlistAdmin;
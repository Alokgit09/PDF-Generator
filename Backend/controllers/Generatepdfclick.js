const express = require("express");
const UserData = require("../models/Userdata");
const PdfData = require("../models/Pdfpathdata");

const generatePdfonClick = async (req, res) => {
    try {
        const { id } = req.params;
        const getidData = await UserData.findOne({ register_id: id });
        let localSend = {
            name: getidData.name,
            registerID: getidData.register_id,
        };
        res.status(201).json(localSend);
        console.log("getidData>>", localSend);

    } catch (err) {
        console.log("Error generating PdfonClick>>>", err);
    }

};

module.exports = generatePdfonClick;
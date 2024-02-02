const adminData = require('../models/Admin');
const bcrypt = require("bcrypt");

const adminRegistration = async (req, res) => {
    try {
        const userAdmininfo = await adminData.create(req.body);
        if (userAdmininfo) {
            const token = await userAdmininfo.GenerateAuthToken();
            res.status(201).json(userAdmininfo);
            // await userAdmininfo.save();
            console.log(token);
        }

    } catch (err) {
        console.log("Error>>>>>", err);
        res.status(400).send({
            message: `Error In Register Controllers`,
            success: false,
            err,
        });
    }

};




const adminLogininfo = async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        const logData = await adminData.findOne({ email: email });
        const isMatch = await bcrypt.compare(password, logData.password);
        // console.log("isMatch>>", logData);
        const token = await logData.GenerateAuthToken();
        console.log("token1>>", token);
        const multiValue = { email: logData.email, Token: token };
        if (isMatch) {
            res.status(201).json(multiValue);
        } else {
            res.status(400).send({ message: "Invalid E-Mail Details" });
        }
    } catch (err) {
        console.log("loging error>>", err);
    }


};


module.exports = {
    adminRegistration,
    adminLogininfo,
};
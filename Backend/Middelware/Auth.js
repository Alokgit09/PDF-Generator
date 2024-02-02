const jwt = require("jsonwebtoken");
const adminSchemaData = require("../models/Admin");

const SECRET_KEY = process.env.JWT_SECRET_KEY;

const auth = async (req, res, next) => {
    try {
        const authorizationHeader = req.header('Authorization');
        const [bearer, token] = authorizationHeader.split(' ');
        console.log('Token:>>>', token);
        if (token) {
            const verifyToken = jwt.verify(token, SECRET_KEY);
            console.log("verify>>>", verifyToken);
            console.log("newdatya", new Date().getTime());
            console.log('Issued At:', new Date(verifyToken.exp * 1000));
            if (verifyToken.exp * 1000 > new Date().getTime()) {
                const user = await adminSchemaData.findOne({
                    _id: verifyToken.id
                });
                console.log("user>>", user);
                req.user = user;
                return next();
            } else {
                return res.status(401).json({
                    success: false,
                    message: "Token is expired",
                });
            }

        } else {
            return res.status(401).json({
                success: false,
                message: "Unthorized access",
            });
        }
    } catch (err) {
        console.log("Error in Authorization:", err);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

module.exports = auth;

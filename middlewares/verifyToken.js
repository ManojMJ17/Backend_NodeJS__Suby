const Vendor = require("../models/Vendor");
const jwt = require("jsonwebtoken");
const dotEnv = require("dotenv");

dotEnv.config();

const secretKey = process.env.WhatIsYourName;

const verifyToken = async (req, res, next) => {
	const token = req.headers.token;

	if (!token) {
		res.status(401).json({ Error: "Token is required" });
	}
	try {
		const decoded = jwt.verify(token, secretKey);
		const vendor = await Vendor.findById(decoded.vendorId);
		if (!vendor) {
			return res.status(404).json({ Error: "Vendor Not Found" });
		}
		req.vendorId = vendor._id;
		next();
	} catch (err) {
		console.error(err);
		return res.status(500).json({ Error: "Invalid Token" });
	}
};

module.exports = verifyToken;

const Vendor = require("../models/Vendor");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const dotEnv = require("dotenv");

dotEnv.config();

const secretKey = process.env.WhatIsYourName;

const vendorRegister = async (req, res) => {
	const { username, email, password } = req.body;
	try {
		const vendorEmail = await Vendor.findOne({ email });
		if (vendorEmail) {
			return res.status(400).json("Email has already taken");
		}
		const hashedPassword = await bcrypt.hash(password, 10);

		const newVendor = new Vendor({
			username,
			email,
			password: hashedPassword,
		});
		await newVendor.save();
		res.status(200).json({ message: "Vendor Register Successfull" });
		console.log("Registered");
	} catch (err) {
		console.log(err);
		res.status(500).json({ err: "Internal Server Error" });
	}
};

const vendorLogin = async (req, res) => {
	const { email, password } = req.body;

	try {
		const vendor = await Vendor.findOne({ email });
		if (!vendor) {
			return res.status(401).json({ error: "Invalid Username or Password" });
		}

		const isPasswordValid = await bcrypt.compare(password, vendor.password);
		if (!isPasswordValid) {
			return res.status(401).json({ error: "Invalid Username or Password" });
		}

		const token = jwt.sign({ vendorId: vendor._id }, secretKey, {
			expiresIn: "1h",
		});

		res.status(200).json({ success: "Login Successful", token });
		console.log(email, "This is Token", token);
	} catch (err) {
		console.log(err);
		res.status(500).json({ err: "Internal Server Error" });
	}
};

const getAllVendors = async (req, res) => {
	try {
		const vendors = await Vendor.find().populate("firm");
		res.json({ vendors });
	} catch (err) {
		console.log(err);
		res.status(500).json({ err: "Internal Server Error" });
	}
};

const getVendorById = async (req, res) => {
	const vendorId = req.params.id;
	try {
		const vendor = await Vendor.findById(vendorId).populate("firm");
		if (!vendor) {
			return res.status(404).json({ error: "Vendor not found" });
		}
		res.json({ vendor });
	} catch (err) {
		console.log(err);
		res.status(500).json({ err: "Internal Server Error" });
	}
};

module.exports = { vendorRegister, vendorLogin, getAllVendors, getVendorById };

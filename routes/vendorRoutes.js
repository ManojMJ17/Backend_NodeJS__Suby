const vendorController = require("../controllers/vendorController");
const express = require("express");

const router = express.Router();

// New Vendor
router.post("/register", vendorController.vendorRegister);

// Login Vendor
router.post("/login", vendorController.vendorLogin);

router.get("/all-vendors", vendorController.getAllVendors);

router.get("/single-vendor/:id", vendorController.getVendorById);

module.exports = router;

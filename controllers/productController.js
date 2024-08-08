const Product = require("../models/Product");
const multer = require("multer");
const Firm = require("../models/Firm");

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, "uploads/");
	},
	filename: (req, file, cb) => {
		cb(
			null,
			file.fieldname + "-" + Date.now() + path.extname(file.originalname)
		);
	},
});

const upload = multer({ storage: storage });

const addProduct = async (req, res) => {
	try {
		const { productName, price, category, bestSeller, description } = req.body;

		const image = req.file ? req.file.filename : undefined;

		const firmId = req.params.firmId;
		const firm = await Firm.findById(firmId);

		if (!firm) {
			return res.status(404).json({ error: "No Firm found" });
		}

		const product = new Product({
			productName,
			price,
			image,
			category,
			bestSeller,
			description,
			firm: firm._id,
		});
		const savedProduct = await product.save();

		firm.products.push(savedProduct);

		await firm.save();

		res.status(200).json(savedProduct);
	} catch (error) {
		console.log(error);
		res.status(500).json({ Error: "Server Error" });
	}
};

const getProductByFirm = async (req, res) => {
	try {
		const firmId = req.params.firmId;
		const firm = await Firm.findById(firmId);

		if (!firm) {
			return res.status(404).json({ error: "No Firm found" });
		}

		const restaurantName = firm.firmName;

		const products = await Product.find({ firm: firmId });

		res.status(200).json({ restaurantName, products });
	} catch (error) {
		console.log(error);
		res.status(500).json({ Error: "Server Error" });
	}
};

const deleteProductById = async (req, res) => {
	try {
		const productId = req.params.id;

		const deletedProduct = await Product.findByIdAndDelete(productId);

		if (!deletedProduct) {
			return res.status(404).json({ error: "No Product found" });
		}
		console.log("Product deleted Successfully");
		res.status(200).json({ message: "Product deleted successfully" });
	} catch (error) {
		console.log(error);
		res.status(500).json({ error: "Server Error" });
	}
};

module.exports = {
	addProduct: [upload.single("image"), addProduct],
	getProductByFirm,
	deleteProductById,
};

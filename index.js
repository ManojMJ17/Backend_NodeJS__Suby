const express = require("express");
const dotEnv = require("dotenv");
const mongoose = require("mongoose");
const vendorRoutes = require("./routes/vendorRoutes");
const firmRoutes = require("./routes/firmRoutes");
const productRoutes = require("./routes/productRoutes");
const path = require("path");
const exp = require("constants");
const cors = require("cors");

const app = express();

const PORT = process.env.PORT || 3000;

dotEnv.config();
app.use(cors());

mongoose
	.connect(process.env.MONGO_URI)
	.then(() => {
		console.log("Mongo DB is Connected");
	})
	.catch((err) => console.log(err));

app.use(express.json());
app.use("/vendor", vendorRoutes);
app.use("/firm", firmRoutes);
app.use("/product", productRoutes);
app.use("/uploads", express.static("uploads"));

app.listen(PORT, () => {
	console.log(`Server Eunning in ${PORT}`);
});

app.use("/", (req, res) => {
	res.send(`<h1>Welcome To Suby`);
});

const express = require("express");
const router = express.Router();

{
	router.use((req, res, next) => {
		next({ status: 404, message: "Endpoint not found." });
	});

	router.use((err, req, res, next) => {
		console.error(err);
		res.status(err.status ?? 500);
		res.json(err.message ?? "Sorry, something broke :(");
	});
}

module.exports = { errorHandler: router };

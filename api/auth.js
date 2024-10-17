const express = require("express");
const prisma = require("../prisma");

const router = express.Router();
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.new.JWT_SECRET;

const createToken = (id) => jwt.sign({ id }, JWT_SECRET, { expiresIn: "1d" });

const verifyToken = async (req, res, next) => {
	try {
		const authHeader = req.headers.authorization;
		const token = authHeader.split(/(?: |Bearer *)/)[1];
		if (!token) return next();

		const { id } = jwt.verify(token, JWT_SECRET);
		req.customer = await prisma.customer.findUniqueOrThrow({
			where: { id },
		});
		next();
	} catch (e) {
		next(e);
	}
};

router.use(verifyToken);

// add any auth routes here

function authenticate(req, res, next) {
	if (req.customer) next();
	else next({ status: 401, message: "You are not logged in." });
}

module.exports = {
	router,
	authenticate,
};

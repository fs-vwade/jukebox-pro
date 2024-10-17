const prisma = require("../prisma");
const express = require("express");
const router = express.Router();

const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

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
router.post("/register", async (req, res, next) => {
	const { email, password } = req.body;
	try {
		const customer = await prisma.customer.register(email, password);
		const token = createToken(customer.id);
		res.status(201).json({ token, message: "User registration." });
	} catch (e) {
		next(e);
	}
});
router.post("/login", async (req, res, next) => {
	const { email, password } = req.body;
	try {
		const customer = await prisma.customer.login(email, password);
		const token = createToken(customer.id);
		res.json({ token, message: "User logged in." });
	} catch (e) {
		next(e);
	}
});

function authenticate(req, res, next) {
	if (req.customer) next();
	else next({ status: 401, message: "You are not logged in." });
}

module.exports = {
	router,
	authenticate,
};

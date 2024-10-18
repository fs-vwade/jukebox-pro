const prisma = require("../prisma");
const express = require("express");
const router = express.Router();

const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

const createToken = (id) => jwt.sign({ id }, JWT_SECRET, { expiresIn: "1d" });

const verifyToken = async (req, res, next) => {
	try {
		const authHeader = String(req.headers.authorization);
		const token = authHeader.split(/(?: |Bearer *)/)[1];
		if (!token) return next();

		const { id } = jwt.verify(token, JWT_SECRET);
		req.user = await prisma.user.findUniqueOrThrow({
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
	const { username, password } = req.body;
	try {
		const user = await prisma.user.register(username, password);
		const token = createToken(user.id);
		res.status(201).json({ token, message: "User registration." });
	} catch (e) {
		next(e);
	}
});
router.post("/login", async (req, res, next) => {
	const { username, password } = req.body;
	try {
		const user = await prisma.user.login(username, password);
		const token = createToken(user.id);
		res.json({ token, message: "User logged in." });
	} catch (e) {
		next(e);
	}
});

function authenticate(req, res, next) {
	if (req.user) next();
	else next({ status: 401, message: "You are not logged in." });
}

module.exports = {
	authRoutes: router,
	authenticate,
};

const express = require("express");
const router = express.Router();

const { authenticate } = require("../api/auth");
const { errorHandler } = require("../middleware");

router.use(require("morgan")("dev"));
router.use(express.json());

router.use("/playlists", authenticate, require("./playlists")); // this entire path requires authentication
router.use("/tracks", require("./tracks"));

module.exports = {
	routes: router,
	errorHandler,
};

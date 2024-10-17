const express = require("express");
const router = express.Router();

const { authenticate } = require("../api/auth");
const { error404, errorHandler } = require("../middleware");

router.use("/playlists", authenticate, require("./playlists")); // this entire path requires authentication
router.use("/tracks", require("./tracks"));

router.use(error404);

module.exports = {
	routes: router,
	errorHandler,
};

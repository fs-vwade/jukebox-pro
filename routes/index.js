const express = require("express");
const router = express.Router();

const { error404, errorHandler } = require("../middleware");

router.use("/playlists", require("./playlists"));
router.use("/tracks", require("./tracks"));

router.use(error404);

module.exports = {
	routes: router,
	errorHandler,
};

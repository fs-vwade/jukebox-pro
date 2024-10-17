const express = require("express");
const router = express.Router();

router.use("/playlists", require("./playlists"));
router.use("/tracks", require("./tracks"));

module.exports = {
	routes: router,
};

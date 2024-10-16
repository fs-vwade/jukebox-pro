// routes/tracks/index.js

const prisma = require("../../prisma");
const express = require("express");
const router = express.Router();

router.get("/", async (req, res, next) => {
	try {
		res.json({
			tracks: await prisma.track.findMany(),
		});
	} catch (e) {
		next(e);
	}
});
router.get("/:id", async (req, res, next) => {
	try {
		const { id } = { id: +req.params.id };

		const track = await prisma.track.findUnique({ where: { id: Number(id) } });

		if (track) {
			if (req.user) {
				res.json({
					...track,
					playlists: await prisma.playlist.findMany({
						where: { ownerId: req.user.id, tracks: { some: { id } } },
					}),
				});
			} else {
				res.json({ track });
			}
		} else {
			next({ error: 404, message: "Track not found." });
		}
	} catch (e) {
		next(e);
	}
});

module.exports = router;

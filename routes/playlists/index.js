// routes/playlists/index.js

const prisma = require("../../prisma");
const express = require("express");
const router = express.Router();

router.get("/", async (req, res, next) => {
	try {
		const { user } = req;
		console.log(user.id);
		res.json({
			playlists: await prisma.playlist.findMany({
				where: { ownerId: user.id },
				include: { tracks: true },
			}),
		});
	} catch (e) {
		next(e);
	}
});
router.get("/:id", async (req, res, next) => {
	try {
		const id = Number(req.params.id);
		const playlist = await prisma.playlist.findUnique({
			where: { id },
			include: { tracks: true },
		});

		if (playlist) {
			res.json({
				playlist,
				tracks: await prisma.track.findMany({
					where: { id: { in: playlist.tracks } },
				}),
			});
		} else {
			next({ error: 403, message: "Forbidden access." });
		}
	} catch (e) {
		next(e);
	}
});
router.post("/", async (req, res, next) => {
	try {
		const { name, description, trackIds } = req.body;
		console.log(req.body);
		console.log(name, description, trackIds);
		console.log(!!name, !!description, !!trackIds);

		if (name && description && Array.isArray(trackIds)) {
			await prisma.playlist.new(name, description, trackIds, req.user);
			res.status(201).send(`Playlist created successfully.`);
		} else {
			next({ status: 400, message: "Bad request." });
		}
	} catch (e) {
		next(e);
	}
});

module.exports = router;

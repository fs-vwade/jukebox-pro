// routes/playlists/index.js

const prisma = require("../../prisma");
const express = require("express");
const router = express.Router();

router.get("/", async (req, res, next) => {
	try {
		res.json({
			playlists: await prisma.playlst.findMany({
				where: { ownerId: req.customer.id },
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

		if (name && description && Array.isArray(trackIds)) {
			await prisma.playlist.create({
				data: {
					name,
					description,
					owner: { connect: { id: req.customer.id } },
					tracks: {
						connect: trackIds.map((e) => ({ id: Number(e) })),
					},
				},
			});
			res.status(201).send(`Playlist created successfully.`);
		} else {
			next({ status: 400, message: "Bad request." });
		}
	} catch (e) {
		next(e);
	}
});

module.exports = router;

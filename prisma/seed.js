const prisma = require("../prisma");
const { faker } = require("@faker-js/faker");

faker.music.playlist = () => `${faker.music.genre()} ${faker.music.album()}`;

const seed = async (user_seeds = 5, track_seeds = 20, playlist_seeds = 10) => {
	const tracks = await prisma.track.createMany({
		data: Array.from(
			{ length: track_seeds * Math.pow(4, Math.random()) },
			() => ({
				name: faker.music.songName(),
			})
		),
	});

	//const users = await prisma.user.createMany({
	//	data: Array.from({ length: user_seeds }, () => ({
	//		username: faker.internet.displayName(),
	//	})),
	//});

	//const playlists = await prisma.playlist.createMany({
	//	data: Array.from({ length: playlist_seeds }, () => ({
	//		name: faker.music.playlist(),
	//		description: faker.lorem.sentences(),
	//		//tracks: { connect: playlist_tracks },
	//		//owner: { connect: { id: user.id } },
	//	})),
	//});
};

seed()
	.then(async () => await prisma.$disconnect())
	.catch(async (e) => {
		console.error(e);
		await prisma.$disconnect();
		process.exit(1);
	});

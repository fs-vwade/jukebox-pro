const prisma = require("../prisma");
const { faker } = require("@faker-js/faker");

faker.music.playlist = () => `${faker.music.genre()} ${faker.music.album()}`;

const seed = async (user_seeds = 5, track_seeds = 20, playlist_seeds = 10) => {
	function random_choice(arr) {
		arr = Array.from(arr);
		return arr[Math.floor(Math.random() * arr.length)];
	}

	const tracks = await prisma.track.createManyAndReturn({
		data: Array.from({ length: track_seeds }, () => ({
			name: faker.music.songName(),
		})),
	});

	const users = await prisma.user.createManyAndReturn({
		data: Array.from({ length: user_seeds }, () => ({
			username: faker.internet.displayName(),
		})),
	});

	const playlists = await prisma.playlist.createManyAndReturn({
		data: Array.from({ length: playlist_seeds }, () => ({
			name: faker.music.playlist(),
			description: faker.lorem.sentences(),
			tracks: { connect: playlist_tracks },
			owner: { connect: { id: user.id } },
		})),
	});

	for (const user of users) {
		const playlist_size = Math.max(
			8,
			Math.floor(Math.random() * tracks.length)
		);
		const playlist_tracks = Array.from({ length: playlist_size }, () => {
			const { id } = random_choice(tracks);
			return { id };
		});
	}
};

seed()
	.then(async () => await prisma.$disconnect())
	.catch(async (e) => {
		console.error(e);
		await prisma.$disconnect();
		process.exit(1);
	});

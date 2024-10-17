const bcrypt = require("bcrypt");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient().$extends({
	model: {
		customer: {
			register: async (email, password) =>
				await prisma.customer.create({
					data: { email, password: await bcrypt.hash(password, 10) },
				}),
			login: async (email, password) => {
				const customer = await prisma.customer.findUniqueOrThrow({
					where: { email },
				});
				if (await bcrypt.compare(password, customer.password)) return customer;
				throw Error("Invalid password");
			},
		},
	},
});

module.exports = prisma;

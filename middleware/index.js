const error404 = (req, res, next) => {
	next({ status: 404, message: "Endpoint not found." });
};

const errorHandler = async function (err, req, res, next) {
	console.error(err);
	res.status(err.status ?? 500);
	res.json(err.message ?? "Sorry, something broke :(");
};

module.exports = {
	error404,
	errorHandler,
};

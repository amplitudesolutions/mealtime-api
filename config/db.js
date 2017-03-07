var env = process.env.NODE_ENV || "development";

if (env === "production" || env === "development")
	url = process.env.MONGODB_URI || "mongodb://localhost:27017/mealtime-api";
else if (env ==="test")
	url = "mongodb://localhost:27017/mealtime-api_test";

module.exports = url
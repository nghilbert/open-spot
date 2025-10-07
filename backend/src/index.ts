// Libraries
import express from "express";

// Runtime config
const environment = process.env.NODE_ENV || "development";
const port = parseInt(process.env.PORT || "5001", 10);

// Setup server
const app = express();

app.get("/api/test", async (req, res) => {
	res.end("Hello from the server!");
});

app.listen(port, () => {
	console.log(`Listening on port ${port}`);
});
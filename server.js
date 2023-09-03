const express = require("express")
const path = require("path")
const { produce, consume } = require("./config")

const { app, server, io } = require("./socketServer")
const { updatePlayerState } = require("./players")

// Serve static files
app.use(express.static(path.join(__dirname, "public")))

// Set view engine
app.set("view engine", "ejs")

// Render index page
app.get("/", (req, res) => {
	res.render("index")
})

// Socket.io connection
io.on("connection", socket => {
	console.log("New user connected!")

	// on user state change
	socket.on("player-state-change", state => {
		updatePlayerState(state)
		produce(state)
	})

	socket.on("disconnect", () => {
		console.log("User disconnected")
	})
})

// Consume messages from kafka
consume()

// Start the server
const PORT = process.env.PORT || 3000
server.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`)
})

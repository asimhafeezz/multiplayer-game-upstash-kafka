const { io } = require("./socketServer")

let players = [
	{
		id: 1,
		name: "player 1",
		y: 0,
	},
	{
		id: 2,
		name: "player 2",
		y: 0,
	},
]

const updatePlayerState = state => {
	//update it in players array
	players[state.id - 1] = state
	io.emit("update-state-by-consumer", { players })
}

module.exports = {
	players,
	updatePlayerState,
}

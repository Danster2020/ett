const express = require("express")
const app = express()
const http = require("http")
const { Server } = require("socket.io")
const cors = require("cors")
const Game = require("./model/game")
const Player = require("./model/player")
const Card = require("./model/card")

// logic
const game = new Game()
const p1 = new Player("kjsdrewmspvdm", "Danne")

for (let i = 0; i < 5; i++) {
    p1.addCard(new Card("red", i))
}
game.addPlayer(p1)


// socket
app.use(cors)
const server = http.createServer(app)

const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
    }
})

game.players[0]

io.on("connection", (socket) => {
    console.log("connected to", socket.id);
    socket.emit("playerData", game.players[0])
})

const port = 3001
server.listen(port, () => {
    console.log("Server running on port " + port + "...");
})
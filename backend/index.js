const express = require("express")
const http = require("http")
const { Server } = require("socket.io")
const cors = require("cors")
const dotenv = require('dotenv');

const Game = require("./model/game")
const Player = require("./model/player")
const Card = require("./model/card")


// logic
const game = new Game()
// const p1 = new Player("kjsdrewmspvdm", "Danne")

// for (let i = 0; i < 5; i++) {
//     p1.addCard(new Card("red", i))
// }
// game.addPlayer(p1)


// socket
const app = express()
const server = http.createServer(app)
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        // origin: process.env.PUBLIC_URL,
        methods: ["GET", "POST"],
        credentials: true,  // Allow cookies to be passed
    }
})

// Apply CORS middleware
app.use(cors({
    origin: "http://localhost:5173",
    // origin: process.env.PUBLIC_URL, 
    credentials: true,  // Allow cookies
}));

// game.players[0]

io.on("connection", (socket) => {
    console.log("connected to", socket.id);

    socket.on("playerID", (playerId) => {

        const re = new RegExp("^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$")

        if (!re.test(playerId)) {
            console.log("Invalid playerID!");
            return
        }

        if (game.playerExists(playerId)) {
            console.log("Player " + playerId + " already exists.");
            socket.emit("playerData", game.getPlayer(playerId))
            return
        }

        const newPlayer = new Player(playerId, "")
        // give new player cards
        for (let i = 0; i < 10; i++) {
            newPlayer.addCard(new Card("yellow", i))
        }

        game.addPlayer(newPlayer)
        socket.emit("playerData", newPlayer)
        console.log("Player " + playerId + " added!");
    })

    socket.on("getGameInfo", () => {
        console.log("sending game info.");
        socket.emit("gameInfo", game.getPublicInfo())
    })

    socket.on("playCard", (data) => {
        console.log("received played card", data);

        if (!game.isLegalAction("playCard", data)) {
            console.log("Can't legally play card!");
            return
        }

        const player = game.getPlayer(data.playerId)
        const cardId = data.cardId

        game.isLegalAction("playCard", data)

        const card = player.getCard(cardId);
        game.addCard(card)
        player.removeCard(cardId)
        socket.emit("gameInfo", game.getPublicInfo())
    })
})





const port = 3001
server.listen(port, () => {
    console.log("Server running on port " + port + "...");
})
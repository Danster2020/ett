const express = require("express")
const app = express()
const http = require("http")
const { Server } = require("socket.io")
const cors = require("cors")

app.use(cors)
const server = http.createServer(app)

const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
    }
})

io.on("connection", (socket) => {
    console.log("connected", socket.id);

})

const port = 3001
server.listen(port, () => {
    console.log("Server running on port " + port + "...");
})
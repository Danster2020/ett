const Card = require("./card")

const Phase = {
    Setup: 0,
    Play: 1,
    End: 2,
}

const TurnDir = {
    Normal: 0,
    Reverse: 1,
}

class Game {
    id;
    phase = Phase.Setup;
    turnDir = TurnDir.Normal;
    players = [];
    currentPlayer;
    cardsOnTable = []

    constructor(id, name) {
        this.id = id
        this.name = name

        this.cardsOnTable.push(new Card())
    }

    playerExists(playerId) {
        return this.players.some(player => {
            return player.id === playerId;
        });
    }

    getPlayer(playerId) {
        return this.players.find(player => player.id === playerId);
    }

    addPlayer(player) {
        this.players.push(player)
    }

    addCard(card) {
        this.cardsOnTable.push(card)
    }

    getPublicInfo() {
        const playersPublicInfo = []
        this.players.forEach(player => {
            playersPublicInfo.push(player.getPublicInfo())
        });
        return { id: this.id, phase: this.phase, turnDir: this.turnDir, players: playersPublicInfo, currentPlayer: this.currentPlayer, cardsOnTable: this.cardsOnTable }
    }

    isLegalAction(action, data) {
        if (action == "PlayCard") {
            const card = data

        }
    }
}

module.exports = Game
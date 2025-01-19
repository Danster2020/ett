const Card = require("./card")
const Player = require("./player")

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
        if (card == null) {
            console.error("Can't add null card!");
            return
        }
        this.cardsOnTable.push(card)
    }

    getCurrentCard() {
        return this.cardsOnTable.at(-1);
    }

    getPublicInfo() {
        const playersPublicInfo = []
        this.players.forEach(player => {
            playersPublicInfo.push(player.getPublicInfo())
        });
        return { id: this.id, phase: this.phase, turnDir: this.turnDir, players: playersPublicInfo, currentPlayer: this.currentPlayer, cardsOnTable: this.cardsOnTable }
    }

    isLegalAction(action, data) {

        if (action === "playCard") {
            const player = this.getPlayer(data.playerId)
            const playedCard = player.getCard(data.cardId)

            console.log("currentCard", this.getCurrentCard());


            console.log("current color", this.getCurrentCard().color);
            console.log("current number", this.getCurrentCard().number);

            console.log("played color", playedCard.color);
            console.log("played number", playedCard.number);


            if (this.getCurrentCard().color === playedCard.color) {
                return true
            }

            if (this.getCurrentCard().number === playedCard.number) {
                return true
            }
        }

        return false
    }
}

module.exports = Game
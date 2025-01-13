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
    }

    addPlayer(player) {
        this.players.push(player)
    }
}

module.exports = Game
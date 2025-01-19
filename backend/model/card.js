const { v4: uuidv4 } = require('uuid');

const colors = ["red", "green", "blue", "yellow"]

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

class Card {
    id;
    color;
    number;

    constructor(color = null, number = null) {
        this.id = uuidv4()

        if (color || number) {
            this.color = color
            this.number = number
        } else {
            this.generateRandomCard()
        }
    }

    generateRandomCard() {
        this.color = colors[getRandomInt(4)]
        this.number = getRandomInt(10)
    }
}

module.exports = Card
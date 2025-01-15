const { v4: uuidv4 } = require('uuid');

class Card {
    id;
    color;
    number;

    constructor(color, number) {
        this.color = color
        this.number = number
        this.id = uuidv4()
    }
}

module.exports = Card
class Player {
    id;
    name;
    cardsInHand = [];

    constructor(id, name) {
        this.id = id
        this.name = name
    }

    addCard(card) {
        this.cardsInHand.push(card)
    }
}

module.exports = Player
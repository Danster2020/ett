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

    getPublicInfo() {
        return { name: this.name, nrOfCardsInHand: this.cardsInHand.length }
    }
}

module.exports = Player
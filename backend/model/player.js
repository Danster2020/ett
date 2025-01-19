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

    removeCard(cardId) {
        this.cardsInHand.some((card, index) => {
            if (card.id === cardId) {
                this.cardsInHand.splice(index, 1);
                return true;
            }
            return false;
        });
    }


    getCard(cardId) {
        return this.cardsInHand.find(card => card.id === cardId);
    }

    getPublicInfo() {
        return { name: this.name, nrOfCardsInHand: this.cardsInHand.length }
    }
}

module.exports = Player
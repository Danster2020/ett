const Phase = {
    Setup: 0,
    Play: 1,
    End: 2,
}

class Game {

    id;
    phase = Phase.Setup;
    turn_direction = [];

    constructor(id, name) {
        this.id = id
        this.name = name
    }
}

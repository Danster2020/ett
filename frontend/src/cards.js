import {
    MeshBasicMaterial,
    BoxGeometry,
    Mesh,
    SRGBColorSpace,
    TextureLoader,
    Vector3,
} from "three";

class Card {
    static cardGeometry = new BoxGeometry(0.4, 0.6, 0.001);
    static textureLoader = new TextureLoader();
    static backTexture = Card.textureLoader.load("/assets/card_cover.png");

    constructor(texturePath, position = [0, 0, 0], rotation = [-0.7, 0, 0], name = "playerCard") {
        // Load textures
        const cardFrontTexture = Card.textureLoader.load(texturePath);
        cardFrontTexture.colorSpace = SRGBColorSpace;

        // Ensure the back texture also uses the correct color space
        Card.backTexture.colorSpace = SRGBColorSpace;

        // Create materials
        const materials = [
            new MeshBasicMaterial(), // Left side
            new MeshBasicMaterial(), // Right side
            new MeshBasicMaterial(), // Top side
            new MeshBasicMaterial(), // Bottom side
            new MeshBasicMaterial({ map: cardFrontTexture }), // Front face
            new MeshBasicMaterial({ map: Card.backTexture }), // Back face
        ];

        // Create mesh
        this.mesh = new Mesh(Card.cardGeometry, materials);
        this.mesh.name = name;

        // Set position and rotation
        if (position instanceof Vector3) {
            this.mesh.position.copy(position);
        } else if (Array.isArray(position)) {
            this.mesh.position.set(...position);
        }

        if (rotation instanceof Vector3) {
            this.mesh.rotation.copy(rotation);
        } else if (Array.isArray(rotation)) {
            this.mesh.rotation.set(...rotation);
        }

        this.mesh.castShadow = true;
    }

    getMesh() {
        return this.mesh;
    }
}

// Example usage
// const CARDS = [];
// const xVec = -0.25;
// const yVec = 6.8;
// const zVec = 4.21;

// for (let i = 1; i < 5; i++) {
//     const position = [xVec + i * 0.25, yVec + i * 0.01, zVec + i * 0.01];
//     const rotation = [-0.7, 0, 0];
//     const card = new Card("/assets/king.png", position, rotation);
//     CARDS.push(card.getMesh());
// }

export { Card };

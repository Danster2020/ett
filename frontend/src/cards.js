import {
    MeshBasicMaterial,
    BoxGeometry,
    Mesh,
    SRGBColorSpace,
    TextureLoader,
    Vector3,
} from "three"

const texture_loader = new TextureLoader
const card_geo = new BoxGeometry(0.4, 0.6, 0.001)

const card_texture_cover = texture_loader.load("/assets/card_cover.png")
card_texture_cover.colorSpace = SRGBColorSpace

const card_texture_1 = texture_loader.load("/assets/king.png")
card_texture_1.colorSpace = SRGBColorSpace

const card_1_mat = [
    new MeshBasicMaterial(),
    new MeshBasicMaterial(),
    new MeshBasicMaterial(),
    new MeshBasicMaterial(),
    new MeshBasicMaterial({ map: card_texture_1 }), // face of card
    new MeshBasicMaterial({ map: card_texture_cover }), // back of card
]

const CARDS = []

const x_vec = 0.5
const y_vec = 6.8
const z_vec = 4.21

for (let i = 1; i < 5; i++) {
    let card = new Mesh(card_geo, card_1_mat)
    card.name = "playerCard"
    card.position.set(x_vec - (i * 0.25), y_vec - (i * 0.01), z_vec - (i * 0.01))
    card.rotation.set(-0.7, 0, 0)
    card.castShadow = true;
    // console.log(card.material[4].map = card_texture_cover);

    CARDS.push(card)
}

export { CARDS, card_texture_cover }
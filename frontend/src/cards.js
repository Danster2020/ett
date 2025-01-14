import {
    ShaderMaterial,
    PlaneGeometry,
    Mesh,
    TextureLoader,
    Vector3,
    SRGBColorSpace,
} from "three";

const assetsFolder = "/assets/"
const colors = ["red", "green", "blue", "yellow"]
const numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]

const backgroundTextureArray = []
const overlayTextureArray = []

let backgroundTexture = ""
let overlayTexture = ""

// for each color
colors.forEach(el => {
    let texturePath = assetsFolder + "card_" + el + ".png"
    // console.log("texturePath", texturePath);
    backgroundTextureArray.push(new TextureLoader().load(texturePath))
});

// for each number
numbers.forEach(el => {
    let texturePath = assetsFolder + "card_nr_" + el + ".png"
    // console.log("texturePath", texturePath);
    overlayTextureArray.push(new TextureLoader().load(texturePath))
});

class Card {

    constructor(
        color,
        number,
        position = [0, 0, 0],
        rotation = [-0.7, 0, 0],
        name = "playerCard"
    ) {

        console.log("color", color);

        switch (color) {
            case "red":
                backgroundTexture = backgroundTextureArray[0]
                break;
            case "green":
                backgroundTexture = backgroundTextureArray[1]
                break;
            case "blue":
                backgroundTexture = backgroundTextureArray[2]
                break;
            case "yellow":
                backgroundTexture = backgroundTextureArray[3]
                break;
            default:
                backgroundTexture += "ERROR"
                break;
        }

        console.log("number", number);

        switch (number) {
            default:
                overlayTexture = overlayTextureArray[number]
                break;
        }

        backgroundTexture.colorSpace = SRGBColorSpace;
        overlayTexture.colorSpace = SRGBColorSpace;

        // Shader material
        const material = new ShaderMaterial({
            uniforms: {
                backgroundTexture: { value: backgroundTexture },
                overlayTexture: { value: overlayTexture },
            },
            vertexShader: `
                varying vec2 vUv;
                void main() {
                    vUv = uv;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform sampler2D backgroundTexture;
                uniform sampler2D overlayTexture;
                varying vec2 vUv;
                void main() {
                    vec4 bgColor = texture2D(backgroundTexture, vUv);
                    vec4 overlayColor = texture2D(overlayTexture, vUv);
                    gl_FragColor = mix(bgColor, overlayColor, overlayColor.a);
                }
            `,
            transparent: true,
        });

        // Create geometry and mesh
        const geometry = new PlaneGeometry(0.4, 0.6);
        this.mesh = new Mesh(geometry, material);

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

        this.mesh.name = name;
    }

    getMesh() {
        return this.mesh;
    }
}

export { Card };

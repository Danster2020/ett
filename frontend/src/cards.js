import {
    ShaderMaterial,
    PlaneGeometry,
    Mesh,
    TextureLoader,
    Vector3,
    SRGBColorSpace,
} from "three";

const Color = {
    RED: 1,
    GREEN: 2,
    BLUE: 3,
    YELLOW: 4
};

class Card {
    static textureLoader = new TextureLoader();

    constructor(
        color,
        number,
        position = [0, 0, 0],
        rotation = [-0.7, 0, 0],
        name = "playerCard"
    ) {

        const assets_folder = "/assets/"

        let backgroundTexturePath = assets_folder
        switch (color) {
            case Color.RED:
                backgroundTexturePath += "red"
                break;
            case Color.GREEN:
                backgroundTexturePath += "green"
                break;
            case Color.BLUE:
                backgroundTexturePath += "blue"
                break;
            case Color.YELLOW:
                backgroundTexturePath += "yellow"
                break;
            default:
                backgroundTexturePath += "ERROR"
                break;
        }
        backgroundTexturePath += "_card.png"
        console.log("backgroundTexturePath", backgroundTexturePath);


        let overlayTexturePath = assets_folder + "card_nr_" + number
        switch (number) {
            default:
                overlayTexturePath + number
        }
        overlayTexturePath += ".png"
        console.log("overlayTexturePath", overlayTexturePath);

        // Load textures
        const backgroundTexture = Card.textureLoader.load(backgroundTexturePath);
        backgroundTexture.colorSpace = SRGBColorSpace;

        const overlayTexture = Card.textureLoader.load(overlayTexturePath);
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

export { Card, Color };

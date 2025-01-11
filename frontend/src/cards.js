import {
    ShaderMaterial,
    PlaneGeometry,
    Mesh,
    TextureLoader,
    Vector3,
    SRGBColorSpace,
} from "three";

class Card {
    static textureLoader = new TextureLoader();

    constructor(
        backgroundTexturePath,
        overlayTexturePath,
        position = [0, 0, 0],
        rotation = [-0.7, 0, 0],
        name = "playerCard"
    ) {
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

export { Card };

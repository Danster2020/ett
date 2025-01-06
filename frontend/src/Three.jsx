import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { useEffect, useRef } from "react";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"
import { CARDS } from './cards';

function Three() {
    const refContainer = useRef(null);
    useEffect(() => {

        const gltf_loader = new GLTFLoader()

        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        // use ref as a mount point of the Three.js scene instead of the document.body
        refContainer.current && refContainer.current.appendChild(renderer.domElement);

        // var geometry = new THREE.BoxGeometry(1, 1, 1);
        // var material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        // var cube = new THREE.Mesh(geometry, material);
        // scene.add(cube);

        renderer.setClearColor(0xFEFEFE);
        renderer.shadowMap.enabled = true
        renderer.toneMapping = THREE.ACESFilmicToneMapping;

        var scene = new THREE.Scene();

        const camera = new THREE.PerspectiveCamera(
            45,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );

        // Sets orbit control to move the camera around.
        const orbit = new OrbitControls(camera, renderer.domElement);
        // orbit.update();

        // Camera positioning.
        camera.position.set(0, 10, 6);
        camera.lookAt(new THREE.Vector3(0, 6, 2))


        // light
        const directional_light = new THREE.DirectionalLight(0xFFFFFF, 0.8)
        directional_light.position.y = 10
        scene.add(directional_light)
        directional_light.castShadow = true
        directional_light.shadow.mapSize.width = 1024
        directional_light.shadow.mapSize.height = 1024

        // light
        const ambient_light = new THREE.AmbientLight(0xA3A3A3, 0.3)
        scene.add(ambient_light)

        gltf_loader.load("/assets/kitchen_table.glb", function (glb) {
            const model = glb.scene
            scene.add(model)
            model.rotateY(Math.PI / 2)
            model.scale.set(0.35, 0.35, 0.35)
            model.position.set(0.25, 0, 0)

            model.traverse(function (node) {
                if (node.isMesh)
                    node.receiveShadow = true
            })
        })

        // Creates a 12 by 12 grid helper.
        const gridHelper = new THREE.GridHelper(12, 12);
        scene.add(gridHelper);

        console.log(CARDS);


        CARDS.forEach(function (card) {
            scene.add(card)
        })

        // Creates an axes helper with an axis length of 4.
        // const axesHelper = new THREE.AxesHelper(4);
        // scene.add(axesHelper);

        function animate() {
            renderer.render(scene, camera);
        }

        renderer.setAnimationLoop(animate);

    }, []);
    return (
        <div ref={refContainer}></div>
    );
}

export default Three



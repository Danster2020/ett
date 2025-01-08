import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { useEffect, useRef } from "react";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"
import { CARDS, card_texture_cover } from './cards';
import gsap from "gsap"


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

        let hovered_card
        const mouse_position = new THREE.Vector2()
        const raycaster = new THREE.Raycaster()

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
        orbit.update();

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

        // gltf_loader.load("/assets/kitchen_table.glb", function (glb) {
        //     const model = glb.scene
        //     scene.add(model)
        //     model.rotateY(Math.PI / 2)
        //     model.scale.set(0.35, 0.35, 0.35)
        //     model.position.set(0.25, 0, 0)

        //     model.traverse(function (node) {
        //         if (node.isMesh)
        //             node.receiveShadow = true
        //     })
        // })

        gltf_loader.load("/assets/table.glb", function (glb) {
            const model = glb.scene
            scene.add(model)
            // model.rotateY(Math.PI / 2)
            // model.scale.set(0.35, 0.35, 0.35)
            // model.position.set(0.25, 0, 0)

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

        // window.addEventListener("mousemove", function (e) {
        //     mouse_position.x = (e.clientX / this.window.innerWidth) * 2 - 1
        //     mouse_position.y = -(e.clientY / this.window.innerHeight) * 2 + 1

        //     raycaster.setFromCamera(mouse_position, camera)

        //     const intersects = raycaster.intersectObject(scene)


        //     if (intersects.length > 0) {
        //         const tl = new gsap.timeline({
        //             defaults: { duration: 0.2, delay: 0.1 }
        //         })

        //         if (intersects[0].object.name.includes("playerCard")) {
        //             hovered_card = intersects[0].object;
        //             console.log("hovered");

        //             tl.to(hovered_card.position, {
        //                 y: 6.8 + 0.1,
        //             }, 0)
        //         } else {
        //             tl.to(hovered_card.position, {
        //                 y: 6.8,
        //             }, 0)
        //         }
        //     }
        // })

        window.addEventListener("click", function (e) {
            mouse_position.x = (e.clientX / this.window.innerWidth) * 2 - 1
            mouse_position.y = -(e.clientY / this.window.innerHeight) * 2 + 1

            raycaster.setFromCamera(mouse_position, camera)

            const intersects = raycaster.intersectObject(scene)


            if (intersects.length > 0) {
                if (intersects[0].object.name.includes("playerCard")) {
                    hovered_card = intersects[0].object

                    const tl = new gsap.timeline({
                        defaults: { duration: 0.4, delay: 0.1 }
                    })

                    tl.to(hovered_card.position, {
                        y: 3.22,
                        z: 0,
                        x: 0
                    }, 0)
                        .to(hovered_card.rotation, {
                            x: -Math.PI / 2,
                            y: 0,
                            z: Math.random()
                        }, 0)
                        .to(hovered_card.scale, {
                            y: 1.5,
                            z: 1.5,
                            x: 1.5
                        }, 0)
                }
            }


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



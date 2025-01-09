import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { useEffect, useRef } from "react";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"
import { Card } from './cards';
import gsap from "gsap"


function Three() {

    const refContainer = useRef(null);
    var scene = new THREE.Scene();
    const CARDS = []
    let nrOfCardsOnTable = 0

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


        const camera = new THREE.PerspectiveCamera(
            45,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );

        // Sets orbit control to move the camera around.
        // const orbit = new OrbitControls(camera, renderer.domElement);
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
        //     mouse_position.x = (e.clientX / this.window.innerWidth) * 2 - 1;
        //     mouse_position.y = -(e.clientY / this.window.innerHeight) * 2 + 1;

        //     raycaster.setFromCamera(mouse_position, camera);

        //     const intersects = raycaster.intersectObjects(scene.children); // Corrected to check all objects in the scene

        //     const cardId = intersects[0].object.id
        //     let originalY = 0
        //     CARDS.forEach((card, index) => {
        //         if (card.id === cardId) {
        //             originalY = 6.8 + 0.01 * index
        //         }
        //     });


        //     if (intersects.length > 0 && intersects[0].object.name.includes("playerCard")) {



        //         const tl = new gsap.timeline({
        //             defaults: { duration: 0.2, delay: 0.1 },
        //         });

        //         const currentCard = intersects[0].object;

        //         if (hovered_card !== currentCard) {
        //             // Reset previously hovered card
        //             if (hovered_card) {
        //                 tl.to(hovered_card.position, {
        //                     y: originalY, // Reset to its original position
        //                 }, 0);
        //             }

        //             // Update hovered_card
        //             hovered_card = currentCard;

        //             // Animate the current hovered card
        //             tl.to(hovered_card.position, {
        //                 y: hovered_card.position.y + 0.1,
        //             }, 0);
        //         }
        //     } else if (hovered_card) {
        //         // Reset the previously hovered card when no cards are hovered
        //         const tl = new gsap.timeline({
        //             defaults: { duration: 0.2, delay: 0.1 },
        //         });

        //         tl.to(hovered_card.position, {
        //             y: originalY, // Reset to its original position
        //         }, 0);

        //         hovered_card = null; // Clear the hovered card
        //     }
        // });

        window.addEventListener("click", function (e) {
            mouse_position.x = (e.clientX / this.window.innerWidth) * 2 - 1
            mouse_position.y = -(e.clientY / this.window.innerHeight) * 2 + 1

            raycaster.setFromCamera(mouse_position, camera)

            const intersects = raycaster.intersectObject(scene)


            if (intersects.length > 0) {
                if (intersects[0].object.name.includes("playerCard")) {
                    hovered_card = intersects[0].object

                    const cardId = intersects[0].object.id
                    CARDS.forEach((card, index) => {
                        if (card.id === cardId) {
                            CARDS.splice(index, 1)
                            nrOfCardsOnTable++
                        }
                    })

                    const tl = new gsap.timeline({
                        defaults: { duration: 0.4, delay: 0.1 }
                    })

                    tl.to(hovered_card.position, {
                        x: 0,
                        y: 3.22 + nrOfCardsOnTable * 0.001,
                        z: 0
                    }, 0)
                        .to(hovered_card.rotation, {
                            x: -Math.PI / 2,
                            y: 0,
                            z: Math.random()
                        }, 0)
                        .to(hovered_card.scale, {
                            x: 1.5,
                            y: 1.5,
                            z: 1.5
                        }, 0)

                    handleCardHandUpdate()
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

    const handleSpawnCard = () => {
        console.log("heelo!");
        const card = new Card("/assets/king.png");
        CARDS.push(card.getMesh())
        scene.add(card.getMesh())
        handleCardHandUpdate()
    }

    const handleRemoveCardFromHand = () => {
        console.log("heelo!");
        const card = new Card("/assets/king.png");
        CARDS.push(card.getMesh())
        scene.add(card.getMesh())
        handleCardHandUpdate()
    }

    const handleCardHandUpdate = () => {
        const xCenter = 0; // Center position for the hand
        const yBase = 6.8; // Base y position
        const zBase = 4.21; // Base z position
        const nrOfCards = CARDS.length;

        const cardSpacing = 0.25 - (0.005 * nrOfCards); // Spacing between cards
        const startX = xCenter - ((nrOfCards - 1) * cardSpacing) / 2; // Calculate the starting X position

        CARDS.forEach((card, index) => {
            const xPosition = startX + index * cardSpacing;
            const yPosition = yBase + 0.01 * index; // Cards stay aligned in y
            const zPosition = zBase + 0.01 * index; // Cards stay aligned in z

            // card.position.set(xPosition, yPosition, zPosition);

            const tl = new gsap.timeline({
                defaults: { duration: 0.4, delay: 0.1 }
            })

            tl.to(card.position, {
                x: xPosition,
                y: yPosition,
                z: zPosition
            }, 0)
        });



    };

    for (let i = 1; i < 5; i++) {
        handleSpawnCard()
    }

    return (
        <>
            <div ref={refContainer}></div>
            <button className='absolute bottom-10 right-10 text-white p-2 bg-blue-600 rounded-lg' onClick={handleSpawnCard}>Test</button>
        </>
    );
}

export default Three



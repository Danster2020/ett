import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { useEffect, useRef, useState } from "react";
import { Card } from './cards';
import gsap from "gsap";

function Three({ playerData, gameInfo, onCardSelect }) {
    const refContainer = useRef(null);
    const sceneRef = useRef(new THREE.Scene());
    const rendererRef = useRef(null);
    const cameraRef = useRef(null);
    const cardsInHandRef = useRef([]);
    const cardsOnTableRef = useRef([]);

    const [nrOfCardsInHand, setNrOfCardsInHand] = useState(0);
    const [clickedCard, setClickedCard] = useState();

    const spawnCard = (id, color, number) => {
        const card = new Card(id, color, number);
        const cardMesh = card.getMesh();
        cardsInHandRef.current.push(cardMesh);
        sceneRef.current.add(cardMesh);
        handleCardHandUpdate();
        setNrOfCardsInHand(cardsInHandRef.current.length);
    };

    const spawnCardOnTable = (id, color, number) => {
        const card = new Card(id, color, number);
        const cardMesh = card.getMesh();

        cardsOnTableRef.current.push(cardMesh);
        sceneRef.current.add(cardMesh);


        const tl = gsap.timeline({
            defaults: { duration: 0.4, delay: 0.1 },
        });
        tl.to(cardMesh.position, {
            x: 0,
            y: 3.22 + cardsOnTableRef.current.length * 0.001,
            z: 0
        }, 0)
            .to(cardMesh.rotation, {
                x: -Math.PI / 2,
                y: 0,
                z: Math.random()
            }, 0)
            .to(cardMesh.scale, {
                x: 1.5,
                y: 1.5,
                z: 1.5
            }, 0)

        // handleCardHandUpdate();
        // setNrOfCardsInHand(cardsInHandRef.current.length);

    };

    const handleCardSpawnClick = () => {
        spawnCard(0, "green", 1);
    };

    const handleCardHandUpdate = () => {
        const xCenter = 0;
        const yBase = 6.8;
        const zBase = 4.21;
        const nrOfCards = cardsInHandRef.current.length;
        const cardSpacing = 0.25 - 0.005 * nrOfCards;
        const startX = xCenter - ((nrOfCards - 1) * cardSpacing) / 2;

        cardsInHandRef.current.forEach((card, index) => {
            const xPosition = startX + index * cardSpacing;
            const yPosition = yBase + 0.01 * index;
            const zPosition = zBase + 0.01 * index;

            gsap.to(card.position, {
                x: xPosition,
                y: yPosition,
                z: zPosition,
                duration: 0.4,
                delay: 0.1,
            });
        });
    };

    useEffect(() => {
        rendererRef.current = new THREE.WebGLRenderer({ antialias: true });
        rendererRef.current.setSize(window.innerWidth, window.innerHeight);
        rendererRef.current.setClearColor(0xFEFEFE);
        rendererRef.current.shadowMap.enabled = true;
        rendererRef.current.toneMapping = THREE.ACESFilmicToneMapping;

        refContainer.current.appendChild(rendererRef.current.domElement);

        cameraRef.current = new THREE.PerspectiveCamera(
            45,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        cameraRef.current.position.set(0, 10, 6);
        cameraRef.current.lookAt(new THREE.Vector3(0, 6, 2));

        const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 0.8);
        directionalLight.position.y = 10;
        directionalLight.castShadow = true;
        sceneRef.current.add(directionalLight);

        const ambientLight = new THREE.AmbientLight(0xA3A3A3, 0.3);
        sceneRef.current.add(ambientLight);

        const gltfLoader = new GLTFLoader();
        gltfLoader.load("/assets/table.glb", (glb) => {
            const model = glb.scene;
            model.traverse((node) => {
                if (node.isMesh) node.receiveShadow = true;
            });
            sceneRef.current.add(model);
        });

        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();

        // Sets orbit control to move the camera around.
        // const orbit = new OrbitControls(cameraRef.current, rendererRef.current.domElement);
        // orbit.update();

        const handleClick = (event) => {
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

            raycaster.setFromCamera(mouse, cameraRef.current);
            const intersects = raycaster.intersectObjects(cardsInHandRef.current);

            if (intersects.length > 0) {
                const selectedCard = intersects[0].object;

                // setClickedCard(selectedCard)
                console.log("selectedCard", selectedCard);

                // Notify parent component
                if (onCardSelect) {
                    onCardSelect(selectedCard.userData);
                }

                console.log("DEBUG", cardsOnTableRef.current.length);



                // console.log("cardsInHandRef.current.length", cardsOnTableRef.current.length);


                // Animate the card to the table
                const tl = gsap.timeline({
                    defaults: { duration: 0.4, delay: 0.1 },
                });
                tl.to(selectedCard.position, {
                    x: 0,
                    y: 3.22 + (cardsOnTableRef.current.length * 0.001) + 0.001,
                    z: 0
                }, 0)
                    .to(selectedCard.rotation, {
                        x: -Math.PI / 2,
                        y: 0,
                        z: Math.random()
                    }, 0)
                    .to(selectedCard.scale, {
                        x: 1.5,
                        y: 1.5,
                        z: 1.5
                    }, 0)


                // Remove the card from the hand (without removing it from the scene)
                const cardIndex = cardsInHandRef.current.findIndex((card) => card === selectedCard);
                if (cardIndex !== -1) {
                    cardsOnTableRef.current.push(cardIndex); // add card to table
                    cardsInHandRef.current.splice(cardIndex, 1); // remove card from hand
                    setNrOfCardsInHand(cardsInHandRef.current.length);

                    // Rearrange the remaining cards in hand
                    handleCardHandUpdate();
                }
            }
        };



        window.addEventListener("click", handleClick);

        const animate = () => {
            rendererRef.current.render(sceneRef.current, cameraRef.current);
        };
        rendererRef.current.setAnimationLoop(animate);

        return () => {
            window.removeEventListener("click", handleClick);
            rendererRef.current.dispose();
        };
    }, []);

    // Effect to monitor changes in playerData and spawn new cards
    useEffect(() => {
        if (playerData) {
            const existingCardNumbers = cardsInHandRef.current.map((card) => card.userData.id);
            const newCards = playerData.cardsInHand.filter(
                (card) => !existingCardNumbers.includes(card.id)
            );

            newCards.forEach((card) => {
                spawnCard(card.id, card.color, card.number);
            });
        }
    }, [playerData]);

    useEffect(() => {
        if (gameInfo && gameInfo.cardsOnTable.length > 0) {
            const existingCards = cardsOnTableRef.current.map((card) => card.userData?.id);
            const newCards = gameInfo.cardsOnTable.filter(
                (card) => !existingCards.includes(card.id)
            );

            newCards.forEach((card) => {
                spawnCardOnTable(card.id, card.color, card.number);
            });
        }
    }, [gameInfo]);

    return (
        <>
            <div ref={refContainer}></div>
            <div className="absolute bottom-20 right-10 p-2">
                <div>{nrOfCardsInHand}</div>
            </div>
            <button
                className="absolute bottom-10 right-10 text-white p-2 bg-blue-600 rounded-lg"
                onClick={handleCardSpawnClick}
            >
                Add Card
            </button>
        </>
    );
}

export default Three;

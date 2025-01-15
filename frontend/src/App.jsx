import { useState, useEffect } from 'react'
import io from "socket.io-client"
import Three from './Three'
import { v4 as uuidv4 } from 'uuid';

const socket = io.connect("http://localhost:3001")

function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return null;
}

if (!getCookie("user_id")) {
  document.cookie = `user_id=${uuidv4()};`
  console.log("cookie created!");
} else {
  console.log("cookie exists.");
}

const user_id = getCookie("user_id")

function App() {
  const [playerData, setPlayerData] = useState()
  const [isConnected, setIsConnected] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);

  const handleCardSelect = (card) => {
    setSelectedCard(card);
    console.log("Card selected in App:", card);

    if (card) {
      console.log("sent played card.");
      socket.emit("playedCard", { playerId: user_id, cardId: card.id })
    }
  };



  useEffect(() => {

    function onConnect() {
      setIsConnected(true);
      socket.emit("playerID", user_id)
      console.log("emitted user_id", user_id);

      socket.on("playerData", (data) => {
        console.log("playerData", data);
        setPlayerData(data)
      })

      console.log("requesting game info...");
      socket.emit("getGameInfo")
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    function onGameInfo(data) {
      console.log("received game info.");
      console.log("gameInfo", data);
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('gameInfo', onGameInfo);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
    };

  }, [])

  // useEffect(() => {
  //   if (selectedCard) {
  //     socket.emit("playedCard", { playerId: user_id, cardId: selectedCard.id })
  //   }
  // }, [selectedCard])


  return (
    <>
      <Three playerData={playerData} onCardSelect={handleCardSelect}></Three>
    </>
  )
}

export default App

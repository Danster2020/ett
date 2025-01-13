import { useState, useEffect } from 'react'
import io from "socket.io-client"
import Three from './Three'

const socket = io.connect("http://localhost:3001")

function App() {
  const [playerData, setPlayerData] = useState()

  const sendMessage = () => {
    socket.emit("")
  }

  useEffect(() => {
    socket.on("playerData", (data) => {
      console.log("playerData", data);
      setPlayerData(data)
    })
  }, [socket])


  return (
    <>
      <Three playerData={playerData}></Three>
    </>
  )
}

export default App

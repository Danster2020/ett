import { useState } from 'react'
import io from "socket.io-client"
import Three from './Three'

// const socket = io.connect("http://localhost:3001")

function App() {
  const [count, setCount] = useState(0)

  const sendMessage = () => {
    socket.emit("")
  }

  return (
    <>
      <Three></Three>
    </>
  )
}

export default App

import { useState } from 'react'
import io from "socket.io-client"
const socket = io.connect("http://localhost:3001")

function App() {
  const [count, setCount] = useState(0)

  const sendMessage = () => {
    socket.emit("")
  }

  return (
    <>
      <div className='text-red-600'>Hello there</div>
    </>
  )
}

export default App

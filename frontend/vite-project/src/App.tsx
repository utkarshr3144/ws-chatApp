import { useState, useRef } from 'react'
import './App.css'

function App() {
  const [room, setRoom] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<string[]>([]);
  const socketRef = useRef<WebSocket | null>(null);

  const sendMessage = () => {
    if (!socketRef.current) { return };

    socketRef.current.send(
      JSON.stringify({
        type: "chat",
        payload: {
          message: message
        }
      })
    )
    setMessage("");
  }


  const joinRoom = () => {
    const socket = new WebSocket("ws://localhost:8080");

    socketRef.current = socket;

    socket.onopen = () => {
      socket.send(
        JSON.stringify({
          type: "join",
          payload: {
            roomId: room
          }
        })
      )
      socket.onmessage = (event) => {
        console.log(event.data)
      }
    }
  }

  return (
    <div className='flex h-screen items-center justify-center bg-gray-100'>
      <div className='w-96 rounded-lg bg-white p-6 shadow-lg'>
        <h1 className='mb-6 text-center text-2xl font-bold'>
          Join Chat Room
        </h1>



        <input type="text" placeholder='Enter Room ID' value={room} onChange={(e) => setRoom(e.target.value)} className='w-full rounded border p-3' />
        <button onClick={joinRoom} className='mt-4 w-full rounded bg-blue-600 p-3 text-white'>Join</button>

        <input
          type="text"
          placeholder="Enter Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="mt-4 w-full rounded border p-3"
        />
        <button
          onClick={sendMessage}
          className="mt-4 w-full rounded bg-green-600 p-3 text-white"
        >
          Send
        </button>


      </div>

    </div>
  )
}

export default App

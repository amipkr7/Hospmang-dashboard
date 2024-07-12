import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import './Community.css'; // Import the CSS file

function Community() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io("https://hospmang-backend.onrender.com/community");
    setSocket(newSocket);

    // Event listener for incoming chat messages
    newSocket.on("chatMessage", (message) => {
      console.log("Received message:", message);
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    // Event listener for welcome message
    newSocket.on("welcome", (message) => {
      console.log("Server:", message);
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const handleInputChange = (e) => {
    e.preventDefault()
    setInput(e.target.value);
  };

  const handleSend = () => {
    if (input.trim()) {
      // Emit message to the server
      socket.emit("message", input);

      // Update local state
      // setMessages((prevMessages) => [...prevMessages, { id: socket.id, message: input }]);
      setInput('');
    }
  };

  return (
    <div className="App">
      <div className="chat-box">
        <div className="messages">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`message ${msg.id === socket.id ? 'my-message' : 'other-message'}`}
            >
              <strong>{msg.id === socket.id ? 'Me' : 'Other'}: </strong>{msg.message}
            </div>
          ))}
        </div>
        <div className="input-box">
          <input
            type="text"
            value={input}
            onChange={handleInputChange}
            placeholder="Type a message..."
          />
          <button onClick={handleSend}>Send</button>
        </div>
      </div>
    </div>
  );
}

export default Community;

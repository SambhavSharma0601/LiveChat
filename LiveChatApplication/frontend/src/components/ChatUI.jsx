import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Send } from "lucide-react";

const WEBSOCKET_URL = "ws://localhost:5000/ws/chat/";

const LiveChat = () => {
  const [username, setUsername] = useState(localStorage.getItem("username") || "");
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [showModal, setShowModal] = useState(!username);
  const messagesEndRef = useRef(null);
  const ws = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    ws.current = new WebSocket(WEBSOCKET_URL);

    ws.current.onopen = () => console.log("Connected to WebSocket");
    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setMessages((prev) => [...prev, { user: data.username, text: data.message }]);
    };
    ws.current.onclose = () => console.log("WebSocket Disconnected");

    return () => {
      ws.current.close();
    };
  }, []);

  const handleSendMessage = () => {
    if (!message.trim()) return;
    ws.current.send(JSON.stringify({ username, message }));
    setMessage("");
  };

  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center bg-black text-white overflow-hidden">
      <h1 className="text-2xl font-bold mb-4 text-white">Live Chat Sambhav BOX</h1>
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-md">
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="bg-gray-900 p-6 rounded-xl shadow-lg text-center">
            <h2 className="text-xl font-semibold mb-4">Enter Username</h2>
            <input
              type="text"
              className="w-full p-2 rounded-lg border border-gray-700 bg-gray-800 text-white focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Your name..."
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <button
              onClick={() => {
                if (username.trim()) {
                  localStorage.setItem("username", username);
                  setShowModal(false);
                }
              }}
              className="mt-4 w-full p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all"
            >
              Continue
            </button>
          </motion.div>
        </div>
      )}
      <div className="w-full max-w-md h-120 flex flex-col border border-white p-2 rounded-lg">
        <div className="h-120 overflow-hidden p-4 space-y-2 flex flex-col justify-end">
          {messages.map((msg, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`max-w-xs p-2 rounded-lg ${
                msg.user === username ? "bg-blue-500 text-white self-end ml-auto" : "bg-gray-700 text-white self-start"
              }`}
            >
              <span className="text-sm font-bold block">{msg.user}</span>
              <p className="break-words">{msg.text}</p>
            </motion.div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <div className="p-3 flex items-center space-x-2 w-full">
          <input
            type="text"
            className="flex-1 p-2 rounded-lg border border-gray-700 bg-gray-800 text-white focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
          />
          <button onClick={handleSendMessage} className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all">
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default LiveChat;

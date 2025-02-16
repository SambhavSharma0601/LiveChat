import { useState, useEffect } from "react";
import "./App.css";
import ChatUI from "./components/ChatUI";

function App() {
  const [response, setResponse] = useState("Loading...");

  useEffect(() => {
    fetch("http://localhost:5000/api/hello") 
      .then((res) => res.json())
      .then((data) => setResponse(data.message)) 
      .catch((error) => console.error("Error fetching data:", error));
  }, []);
  console.log(response)

  return (
    <div className="App1">
      {/* <h1>Hello from {response}</h1> */}
      <ChatUI />
    </div>
  );
}

export default App;

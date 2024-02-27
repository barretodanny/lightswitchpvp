import { useEffect, useState } from "react";
import { MessageType, User } from "./types/types";
import LandingPage from "./pages/LandingPage/LandingPage";
import MainLobby from "./pages/MainLobby/MainLobby";

import "./global.css";

function App() {
  const [socket, setSocket] = useState<WebSocket>();
  const [self, setSelf] = useState<User | undefined>();
  const [currentPage, setCurrentPage] = useState("LANDING_PAGE");

  useEffect(() => {
    if (socket) {
      const to = setTimeout(() => {
        alert("Error connecting to the server.");
      }, 3000);

      if (socket?.readyState === 1) {
        clearTimeout(to);
        setCurrentPage("MAIN_LOBBY");
      }

      return () => {
        clearTimeout(to);
      };
    }
  }, [socket, socket?.readyState]);

  function connectToServer() {
    const socket = new WebSocket("ws://localhost:3000");

    socket.onmessage = async (event) => {
      const data = JSON.parse(event.data);

      if (data.messageType === "GET_SELF") {
        const self = data.data;
        setSelf(self);
      }
      // else if (data.messageType === "GET_CONNECTED_USERS") {
      //   const connectedUsers = data.data;
      //   setConnectedUsers(connectedUsers);
      // } else if (data.messageType === "GET_LOBBIES") {
      //   const lobbies = data.data;
      //   setLobbies(lobbies);
      // }
    };

    setSocket(socket);
  }

  function handleUpdateUsername(e: React.FormEvent, newUsername: string) {
    e.preventDefault();

    const req = {
      type: MessageType.UPDATE_USERNAME,
      payload: newUsername,
    };
    socket?.send(JSON.stringify(req));
  }

  return (
    <>
      {currentPage === "LANDING_PAGE" && (
        <LandingPage connectToServer={connectToServer} />
      )}
      {currentPage === "MAIN_LOBBY" && (
        <MainLobby self={self} handleUpdateUsername={handleUpdateUsername} />
      )}
    </>
  );
}

export default App;

import { useEffect, useState } from "react";
import { Lobby as LobbyType, MessageType, Pages, User } from "./types/types";
import LandingPage from "./pages/LandingPage/LandingPage";
import MainLobby from "./pages/MainLobby/MainLobby";
import Lobby from "./pages/Lobby/Lobby";

import "./global.css";

function App() {
  const [socket, setSocket] = useState<WebSocket>();
  const [self, setSelf] = useState<User | undefined>();
  const [connectedUsers, setConnectedUsers] = useState<User[]>([]);
  const [lobbies, setLobbies] = useState<LobbyType[]>([]);
  const [lobby, setLobby] = useState<LobbyType | undefined>();
  const [currentPage, setCurrentPage] = useState<Pages>(Pages.LANDING_PAGE);

  useEffect(() => {
    if (socket) {
      const to = setTimeout(() => {
        alert("Error connecting to the server.");
      }, 3000);

      if (socket?.readyState === socket.OPEN) {
        clearTimeout(to);
        setCurrentPage(Pages.MAIN_LOBBY);
      }

      return () => {
        clearTimeout(to);
      };
    }
  }, [socket, socket?.readyState]);

  useEffect(() => {
    if (!self) {
      return;
    }

    if (parseInt(self.lobby) === 0) {
      setCurrentPage(Pages.MAIN_LOBBY);
    } else {
      setCurrentPage(Pages.LOBBY);
    }
  }, [self?.lobby]);

  function connectToServer() {
    const socket = new WebSocket("ws://localhost:3000");

    socket.onmessage = async (event) => {
      const data = JSON.parse(event.data);

      if (data.messageType === MessageType.GET_SELF) {
        const self = data.data;
        setSelf(self);
      } else if (data.messageType === MessageType.GET_CONNECTED_USERS) {
        const connectedUsers = data.data;
        setConnectedUsers(connectedUsers);
      } else if (data.messageType === MessageType.GET_LOBBIES) {
        const lobbies = data.data;
        setLobbies(lobbies);
      } else if (data.messageType === MessageType.GET_LOBBY) {
        const lobby = data.data;
        setLobby(lobby);
      }
    };

    setSocket(socket);
  }

  function handleUpdateUsername(e: React.FormEvent, newUsername: string) {
    e.preventDefault();

    if (socket?.readyState === socket?.CLOSED) {
      alert("Error connecting to server.");
    }

    const req = {
      type: MessageType.UPDATE_USERNAME,
      payload: newUsername,
    };
    socket?.send(JSON.stringify(req));
  }

  function handleCreateLobby(e: React.FormEvent, lobbyName: string) {
    e.preventDefault();

    if (socket?.readyState === socket?.CLOSED) {
      alert("Error connecting to server.");
    }

    const req = {
      type: MessageType.CREATE_LOBBY,
      payload: lobbyName,
    };
    socket?.send(JSON.stringify(req));
  }

  function handleJoinLobby(lobbyId: string) {
    const req = {
      type: MessageType.JOIN_LOBBY,
      payload: lobbyId,
    };
    socket?.send(JSON.stringify(req));
  }

  function handleLeaveLobby(lobbyId: string) {
    const req = {
      type: MessageType.LEAVE_LOBBY,
      payload: lobbyId,
    };
    socket?.send(JSON.stringify(req));
  }

  function handleUpdateLobbyName(e: React.FormEvent, newLobbyname: string) {
    e.preventDefault();

    const req = {
      type: MessageType.UPDATE_LOBBY_NAME,
      payload: newLobbyname,
    };
    socket?.send(JSON.stringify(req));
  }

  return (
    <>
      {currentPage === Pages.LANDING_PAGE && (
        <LandingPage connectToServer={connectToServer} />
      )}
      {currentPage === Pages.MAIN_LOBBY && (
        <MainLobby
          self={self}
          connectedUsers={connectedUsers}
          lobbies={lobbies}
          handleUpdateUsername={handleUpdateUsername}
          handleCreateLobby={handleCreateLobby}
          handleJoinLobby={handleJoinLobby}
        />
      )}
      {currentPage === Pages.LOBBY && (
        <Lobby
          self={self}
          lobby={lobby}
          handleLeaveLobby={handleLeaveLobby}
          handleUpdateLobbyName={handleUpdateLobbyName}
        />
      )}
    </>
  );
}

export default App;

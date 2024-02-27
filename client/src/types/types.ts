export interface User {
  userId: string;
  username: string;
  lobby: string;
}

export interface Lobby {
  lobbyId: string;
  creatorId: string;
  lobbyName: string;
  connectedUsers: string[];
  lobbyState: string;
  user1Score: string;
  user2Score: string;
  lightState: string;
  gameTimer: string;
}

export enum Pages {
  LANDING_PAGE = "LANDING_PAGE",
  MAIN_LOBBY = "MAIN_LOBBY",
  LOBBY = "LOBBY",
}

export enum MessageType {
  GET_SELF = "GET_SELF",
  GET_CONNECTED_USERS = "GET_CONNECTED_USERS",
  UPDATE_USERNAME = "UPDATE_USERNAME",
  GET_LOBBIES = "GET_LOBBIES",
  GET_LOBBY = "GET_LOBBY",
  CREATE_LOBBY = "CREATE_LOBBY",
  JOIN_LOBBY = "JOIN_LOBBY",
  LEAVE_LOBBY = "LEAVE_LOBBY",
}

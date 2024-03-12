export interface User {
  userId: string;
  username: string;
  lobby: string;
}

export interface LobbyPlayer {
  userId: string;
  username: string;
  lobby: string;
  readyStatus: string;
  color: string;
}

interface LobbySettings {
  gameTimer: string;
  randomizeSwitch: string;
}

export interface Lobby {
  lobbyId: string;
  creatorId: string;
  lobbyName: string;
  connectedUsers: string[];
  settings: LobbySettings;
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
  UPDATE_LOBBY_NAME = "UPDATE_LOBBY_NAME",
  UPDATE_LOBBY_GAME_TIMER = "UPDATE_LOBBY_GAME_TIMER",
  TOGGLE_LOBBY_RANDOMIZE_SWITCH = "TOGGLE_LOBBY_RANDOMIZE_SWITCH",
  TOGGLE_LOBBY_PLAYER_READY_STATUS = "TOGGLE_LOBBY_PLAYER_READY_STATUS",
  UPDATE_LOBBY_PLAYER_COLOR_CHOICE = "UPDATE_LOBBY_PLAYER_COLOR_CHOICE",
  LOBBY_START_GAME = "LOBBY_START_GAME",
}

export enum LobbyStates {
  SETUP = "SETUP",
  COUNTDOWN = "COUNTDOWN",
  GAME = "GAME",
  POST_GAME = "POST_GAME",
}

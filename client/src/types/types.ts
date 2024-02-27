export interface User {
  userId: string;
  username: string;
  lobby: string;
}

export enum MessageType {
  UPDATE_USERNAME = "UPDATE_USERNAME",
}

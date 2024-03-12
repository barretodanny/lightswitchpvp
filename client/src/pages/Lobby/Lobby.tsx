import { useState } from "react";
import {
  LobbyPlayer,
  LobbyStates,
  Lobby as LobbyType,
  User,
} from "../../types/types";
import LobbyCountdown from "../LobbyCountdown/LobbyCountdown";

interface LobbyProps {
  self: User | undefined;
  lobby: LobbyType | undefined;
  handleLeaveLobby(lobbyId: string): void;
  handleUpdateLobbyName(e: React.FormEvent, newLobbyname: string): void;
  handleUpdateLobbyGameTimer(e: React.FormEvent, newGameTimer: string): void;
  handleLobbyRandomizeSwitchToggle(e: React.FormEvent): void;
  handleToggleLobbyUserReadyStatus(e: React.FormEvent, index: string): void;
  handleUpdateLobbyUserColorChoice(
    e: React.FormEvent,
    index: string,
    color: string
  ): void;
  handleStartMatch(): void;
}

function Lobby({
  self,
  lobby,
  handleLeaveLobby,
  handleUpdateLobbyName,
  handleUpdateLobbyGameTimer,
  handleLobbyRandomizeSwitchToggle,
  handleToggleLobbyUserReadyStatus,
  handleUpdateLobbyUserColorChoice,
  handleStartMatch,
}: LobbyProps) {
  const [lobbynameField, setLobbynameField] = useState(lobby?.lobbyName || "");

  if (!lobby || !self) {
    return;
  }

  if (lobby.lobbyState === LobbyStates.COUNTDOWN) {
    return <LobbyCountdown />;
  }

  // check if all players in lobby are ready to determine if the host can start the match
  const readyUsers = lobby.connectedUsers.filter(
    (user: any) => user.readyStatus === true
  );
  const canStart =
    lobby.connectedUsers.length > 1 &&
    lobby.connectedUsers.length === readyUsers.length;

  const takenColors: number[] = [];
  for (let i = 0; i < lobby.connectedUsers.length; i++) {
    // @ts-ignore
    const player: LobbyPlayer = lobby.connectedUsers[i];
    // @ts-ignore
    takenColors.push(player.color);
  }
  console.log(takenColors);

  function getColorString(color: string) {
    const colorVal = parseInt(color);

    switch (colorVal) {
      case 0:
        return "Red";
      case 1:
        return "Yellow";
      case 2:
        return "Blue";
      case 3:
        return "Green";
      case 4:
        return "Orange";
      case 5:
        return "Purple";
      case 6:
        return "White";
      default:
        break;
    }
  }

  return (
    <div>
      <p>ID: {lobby.lobbyId}</p>
      <p>Name: {lobby.lobbyName}</p>
      {self.userId === lobby.creatorId && (
        <div>
          <p>CREATOR</p>
          <div>
            <form onSubmit={(e) => handleUpdateLobbyName(e, lobbynameField)}>
              <input
                type="text"
                value={lobbynameField}
                onChange={(e) => setLobbynameField(e.target.value)}
              />
              <button>Update lobby name</button>
            </form>
          </div>
        </div>
      )}
      <div>
        <p>settings</p>
        <p>game timer:{lobby.settings.gameTimer}</p>
        {self.userId === lobby.creatorId && (
          <div>
            <button onClick={(e) => handleUpdateLobbyGameTimer(e, "30")}>
              30
            </button>
            <button onClick={(e) => handleUpdateLobbyGameTimer(e, "60")}>
              60
            </button>
            <button onClick={(e) => handleUpdateLobbyGameTimer(e, "120")}>
              120
            </button>
            <button onClick={(e) => handleUpdateLobbyGameTimer(e, "300")}>
              300
            </button>
          </div>
        )}
        <p>
          randomize switch: {lobby.settings.randomizeSwitch ? "on" : "off"}
          {self.userId === lobby.creatorId && (
            <button onClick={(e) => handleLobbyRandomizeSwitchToggle(e)}>
              Turn {!lobby.settings.randomizeSwitch ? "on" : "off"}
            </button>
          )}
        </p>
      </div>
      <p>Connected users:</p>
      <div>
        {/* @ts-ignore */}
        {lobby.connectedUsers.map((user: LobbyPlayer, index) => {
          return (
            <div key={user.userId}>
              <span>
                {user.userId} - {user.username} ---{" "}
                {lobby.creatorId === user.userId ? (
                  <>
                    <span>(HOST)</span>

                    {self.userId === user.userId && canStart && (
                      <button onClick={handleStartMatch}>Start</button>
                    )}
                  </>
                ) : (
                  <>
                    <span>{user.readyStatus ? "READY" : "NOT READY"}</span>
                    {self.userId === user.userId && (
                      <button
                        onClick={(e) =>
                          handleToggleLobbyUserReadyStatus(e, index.toString())
                        }
                      >
                        {!user.readyStatus ? "READY" : "UNREADY"}
                      </button>
                    )}
                  </>
                )}
                --- {getColorString(user.color)}
              </span>
              {self.userId === user.userId && (
                <div>
                  <p>Choose a color:</p>
                  <button
                    disabled={takenColors.includes(0)}
                    onClick={(e) =>
                      handleUpdateLobbyUserColorChoice(e, index.toString(), "0")
                    }
                  >
                    Red
                  </button>
                  <button
                    disabled={takenColors.includes(1)}
                    onClick={(e) =>
                      handleUpdateLobbyUserColorChoice(e, index.toString(), "1")
                    }
                  >
                    Yellow
                  </button>
                  <button
                    disabled={takenColors.includes(2)}
                    onClick={(e) =>
                      handleUpdateLobbyUserColorChoice(e, index.toString(), "2")
                    }
                  >
                    Blue
                  </button>
                  <button
                    disabled={takenColors.includes(3)}
                    onClick={(e) =>
                      handleUpdateLobbyUserColorChoice(e, index.toString(), "3")
                    }
                  >
                    Green
                  </button>
                  <button
                    disabled={takenColors.includes(4)}
                    onClick={(e) =>
                      handleUpdateLobbyUserColorChoice(e, index.toString(), "4")
                    }
                  >
                    Orange
                  </button>
                  <button
                    disabled={takenColors.includes(5)}
                    onClick={(e) =>
                      handleUpdateLobbyUserColorChoice(e, index.toString(), "5")
                    }
                  >
                    Purple
                  </button>
                  <button
                    disabled={takenColors.includes(6)}
                    onClick={(e) =>
                      handleUpdateLobbyUserColorChoice(e, index.toString(), "6")
                    }
                  >
                    White
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
      <button onClick={() => handleLeaveLobby(lobby.lobbyId)}>Leave</button>
    </div>
  );
}

export default Lobby;

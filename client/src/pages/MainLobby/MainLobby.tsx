import { useState } from "react";
import { User } from "../../types/types";

import styles from "./MainLobby.module.css";

interface MainLobbyProps {
  self: User | undefined;
  handleUpdateUsername(e: React.FormEvent, newUsername: string): void;
}

function MainLobby({ self, handleUpdateUsername }: MainLobbyProps) {
  const [usernameField, setUsernameField] = useState(self?.username || "");

  return (
    <div className={styles.container}>
      <h1>Lightswitch PVP</h1>
      <h2>Welcome {self?.username}</h2>
      <div className={styles.formWrapper}>
        <p>Choose your username</p>
        <form
          onSubmit={(e: React.FormEvent) =>
            handleUpdateUsername(e, usernameField)
          }
        >
          <input
            type="text"
            value={usernameField}
            onChange={(e) => setUsernameField(e.target.value)}
          />
          <button>Update</button>
        </form>
      </div>
    </div>
  );
}

export default MainLobby;

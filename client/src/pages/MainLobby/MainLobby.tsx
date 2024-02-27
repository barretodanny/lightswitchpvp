import { useState } from "react";
import { User } from "../../types/types";

import styles from "./MainLobby.module.css";

interface MainLobbyProps {
  self: User | undefined;
}

function MainLobby({ self }: MainLobbyProps) {
  const [usernameField, setUsernameField] = useState(self?.username);

  return (
    <div className={styles.container}>
      <h1>Lightswitch PVP</h1>
      <div className={styles.formWrapper}>
        <p>Choose your username</p>
        <form onSubmit={() => {}}>
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

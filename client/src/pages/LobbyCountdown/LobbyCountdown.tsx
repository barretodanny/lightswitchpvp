import { useEffect, useState } from "react";

function LobbyCountdown() {
  const [timer, setTimer] = useState(3);

  useEffect(() => {
    const itv = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => {
      clearInterval(itv);
    };
  }, []);

  return <div>{timer}</div>;
}

export default LobbyCountdown;

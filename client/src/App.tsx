import LandingPage from "./pages/LandingPage/LandingPage";

import "./global.css";
import { useState } from "react";
import MainLobby from "./pages/MainLobby/MainLobby";

function App() {
  const [currentPage, setCurrentPage] = useState("LANDING_PAGE");

  return (
    <>
      {currentPage === "LANDING_PAGE" && (
        <LandingPage setCurrentPage={setCurrentPage} />
      )}
      {currentPage === "MAIN_LOBBY" && <MainLobby />}
    </>
  );
}

export default App;

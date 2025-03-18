import { useState, useEffect } from "react";
import "./App.css";
import { LandingScreen } from "./components/LandingScreen";
import { GamePage } from "./components/GamePage";
import { Difficulty } from "./components/Difficulty";

function App() {
  const [gamePage, updateDisplayScreen] = useState(false); // To control the transition to Difficulty
  const [startGame, updateStartGame] = useState(false); // To control when the game starts
  const [diffLevel, updateDiffLevel] = useState(""); // To control when the game starts
  const [winStatus, updateWinStatus] = useState(false);
  const [loseStatus, updateLoseStatus] = useState(false);
  const [highscore, updateHighscore] = useState(
    localStorage.getItem("highscore") ? localStorage.getItem("highscore") : 0
  );
  useEffect(() => {
    updateStartGame(false);
    updateDiffLevel("");
    updateLoseStatus(false);
  }, [loseStatus]);

  // LandingScreen should appear if neither gamePage nor startGame is true
  if (!gamePage && !startGame) {
    return <LandingScreen updateDisplayScreen={updateDisplayScreen} />;
  }

  // Difficulty screen should appear if gamePage is true but startGame is false
  else if (gamePage && !startGame) {
    return (
      <Difficulty
        updateGameStart={updateStartGame}
        updateDiffLevel={updateDiffLevel}
      />
    );
  }

  // Once startGame is true, the GamePage should appear
  else {
    return (
      <GamePage
        diffLevel={diffLevel}
        updateLoseStatus={updateLoseStatus}
        updateWinStatus={updateWinStatus}
        highscore={highscore}
        updateHighscore={updateHighscore}
      />
    );
  }
}

export default App;

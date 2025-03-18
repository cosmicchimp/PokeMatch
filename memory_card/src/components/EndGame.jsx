export function EndGame({
  winStatus,
  updateWinStatus,
  updateLoseStatus,
  updateStartGame,
  updateDiffLevel,
  updateDisplayScreen,
  diffLevel,
}) {
  function handlePlayAgain() {
    updateLoseStatus(false);
    updateWinStatus(false);
  }
  function handleQuit() {
    updateDiffLevel("");
    updateStartGame(false);
    updateWinStatus(false);
    updateLoseStatus(false);
    updateDisplayScreen(false);
  }
  console.log(diffLevel);
  return (
    <div className="endGameWrapper">
      <div className="endGameModule">{`You ${
        winStatus ? "won!" : "lost!"
      }`}</div>
      <img
        src={`${
          winStatus
            ? "../../public/assets/happyPika.gif"
            : "../../public/assets/cryingPika.gif"
        }`}
        alt=""
      />
      <div className="buttonBox">
        {" "}
        <button onClick={handlePlayAgain}>Play Again</button>
        <button onClick={handleQuit}>Quit</button>
      </div>
    </div>
  );
}

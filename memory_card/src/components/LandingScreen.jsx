import { useState } from "react";
export function LandingScreen({ updateDisplayScreen }) {
  function handleClick() {
    updateDisplayScreen(true);
  }
  return (
    <>
      {/* <div className="modalWrapper"> */}
      <div className="startGameModal">
        <div>
          <h1>Tutorial:</h1>
        </div>
        <div>
          {" "}
          <p>
            This is a memory card game. The goal of the game is to click each
            card, without choosing one that you have already previously clicked.
            There are three levels of difficulty, each with more cards than the
            last.
          </p>
        </div>
        <div>
          {" "}
          <button onClick={handleClick}>Start</button>
        </div>
      </div>
      {/* </div> */}
    </>
  );
}

import { useState, useEffect } from "react";
import pokeball from "../../public/assets/pokeball.png";

export function GamePage({
  diffLevel,
  updateLoseStatus,
  updateWinStatus,
  highscore,
  updateHighscore,
  updateStartGame,
  updateDiffLevel,
}) {
  const [pokeCardData, updateCardData] = useState([]);
  const [score, updateScore] = useState(0);
  const [clickedCards, updateClickedCards] = useState([]);
  const [flipped, updateFlipped] = useState("");
  function returnToHome() {
    updateDiffLevel("");
    updateStartGame(false);
  }
  function handleGithub() {
    window.open(
      "https://github.com/cosmicchimp/Game_Projects/tree/main/memory_card",
      "_blank"
    );
  }
  function shuffleArray(array) {
    let shuffledArray = [...array];
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [
        shuffledArray[j],
        shuffledArray[i],
      ];
    }
    return shuffledArray;
  }
  useEffect(() => {
    if (score > highscore) {
      updateHighscore(score);
      localStorage.setItem("highscore", score);
    }
  }, [score]);
  function handleCardClick(e) {
    updateFlipped("flipped");
    const clickedPokemon = e.currentTarget.id; // Ensures correct id
    if (
      !clickedCards.includes(clickedPokemon) &&
      clickedCards.length == pokeCardData.length - 1
    ) {
      updateScore((prev) => prev + 1);
      updateWinStatus(true);
    } else if (clickedCards.includes(clickedPokemon)) {
      updateCardData((prev) => shuffleArray(prev));
      updateLoseStatus(true);
    } else {
      updateClickedCards((prev) => [...prev, clickedPokemon]);
      updateScore((prev) => prev + 1);
      updateCardData((prev) => shuffleArray(prev)); // Shuffle after a successful click
    }
    setTimeout(() => {
      updateFlipped("");
    }, 1000); // Reset flipped state after 1 second
  }

  async function getPokemon(numOfPokemon) {
    let rawPokeJson = [];
    for (let i = 0; i < numOfPokemon; i++) {
      let randomNum = Math.floor(Math.random() * 400);
      let pokecard = fetch(
        `https://pokeapi.co/api/v2/pokemon/${randomNum}`
      ).then((res) => res.json());
      if (!rawPokeJson.contains(pokecard)) {
        rawPokeJson.push(pokecard);
      } else {
        let newRandomNum = Math.floor(Math.random() * 200);
        while (newRandomNum == randomNum) {
          newRandomNum = Math.floor(Math.random() * 300);
        }
        pokecard = fetch(
          `https://pokeapi.co/api/v2/pokemon/${newRandomNum}`
        ).then((res) => res.json());
        rawPokeJson.push(pokecard);
      }
      rawPokeJson.push();
    }
    const receivedPokeData = await Promise.all(rawPokeJson);
    updateCardData(
      receivedPokeData.map((pokemon) => ({
        name: pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1),
        sprite: pokemon.sprites.front_default,
      }))
    );
  }

  useEffect(() => {
    if (diffLevel === "Easy") {
      getPokemon(6);
    } else if (diffLevel === "Medium") {
      getPokemon(8);
    } else {
      getPokemon(12);
    }
  }, [diffLevel]);

  return (
    <div className="gameWrapper">
      <div className="titleBox" onClick={returnToHome}>
        <img className="pokeballLogo" src={pokeball} alt="A pokeball" />
        <div className="gameTitle">
          <span
            style={{
              color: "red",
            }}
          >
            Poké
          </span>
          <span
            style={{
              color: "white",
            }}
          >
            Match
          </span>
        </div>
      </div>
      <div className="scoreBox">
        Score: {score}/{pokeCardData.length}
        <div className="highScore">
          High Score:{" "}
          {localStorage.getItem("highscore")
            ? localStorage.getItem("highscore")
            : score}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 576 512"
            className="trophyIcon"
          >
            <path
              fill="#FFD43B"
              d="M400 0L176 0c-26.5 0-48.1 21.8-47.1 48.2c.2 5.3 .4 10.6 .7 15.8L24 64C10.7 64 0 74.7 0 88c0 92.6 33.5 157 78.5 200.7c44.3 43.1 98.3 64.8 138.1 75.8c23.4 6.5 39.4 26 39.4 45.6c0 20.9-17 37.9-37.9 37.9L192 448c-17.7 0-32 14.3-32 32s14.3 32 32 32l192 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-26.1 0C337 448 320 431 320 410.1c0-19.6 15.9-39.2 39.4-45.6c39.9-11 93.9-32.7 138.2-75.8C542.5 245 576 180.6 576 88c0-13.3-10.7-24-24-24L446.4 64c.3-5.2 .5-10.4 .7-15.8C448.1 21.8 426.5 0 400 0zM48.9 112l84.4 0c9.1 90.1 29.2 150.3 51.9 190.6c-24.9-11-50.8-26.5-73.2-48.3c-32-31.1-58-76-63-142.3zM464.1 254.3c-22.4 21.8-48.3 37.3-73.2 48.3c22.7-40.3 42.8-100.5 51.9-190.6l84.4 0c-5.1 66.3-31.1 111.2-63 142.3z"
            />
          </svg>
        </div>
      </div>
      <div className="pokemonContainer">
        {pokeCardData.map((pokemon) => (
          <button
            className={`pokemonCard`}
            key={pokemon.name}
            id={pokemon.name}
            onClick={handleCardClick}
          >
            <div>
              <img
                src={pokemon.sprite}
                className="pokePhoto"
                alt={`A Pokémon named: ${pokemon.name}`}
              />
            </div>
            <div>
              <p className="pokemonTitle">{pokemon.name}</p>
            </div>
          </button>
        ))}
      </div>
      <div className="githubButton" onClick={handleGithub}>
        {" "}
        <svg
          className="svgIcon"
          xmlns="http://www.w3.org/2000/svg"
          x="0px"
          y="0px"
          width="100"
          height="100"
          viewBox="0 0 50 50"
          fill="#ffffff"
        >
          <path d="M17.791,46.836C18.502,46.53,19,45.823,19,45v-5.4c0-0.197,0.016-0.402,0.041-0.61C19.027,38.994,19.014,38.997,19,39 c0,0-3,0-3.6,0c-1.5,0-2.8-0.6-3.4-1.8c-0.7-1.3-1-3.5-2.8-4.7C8.9,32.3,9.1,32,9.7,32c0.6,0.1,1.9,0.9,2.7,2c0.9,1.1,1.8,2,3.4,2 c2.487,0,3.82-0.125,4.622-0.555C21.356,34.056,22.649,33,24,33v-0.025c-5.668-0.182-9.289-2.066-10.975-4.975 c-3.665,0.042-6.856,0.405-8.677,0.707c-0.058-0.327-0.108-0.656-0.151-0.987c1.797-0.296,4.843-0.647,8.345-0.714 c-0.112-0.276-0.209-0.559-0.291-0.849c-3.511-0.178-6.541-0.039-8.187,0.097c-0.02-0.332-0.047-0.663-0.051-0.999 c1.649-0.135,4.597-0.27,8.018-0.111c-0.079-0.5-0.13-1.011-0.13-1.543c0-1.7,0.6-3.5,1.7-5c-0.5-1.7-1.2-5.3,0.2-6.6 c2.7,0,4.6,1.3,5.5,2.1C21,13.4,22.9,13,25,13s4,0.4,5.6,1.1c0.9-0.8,2.8-2.1,5.5-2.1c1.5,1.4,0.7,5,0.2,6.6c1.1,1.5,1.7,3.2,1.6,5 c0,0.484-0.045,0.951-0.11,1.409c3.499-0.172,6.527-0.034,8.204,0.102c-0.002,0.337-0.033,0.666-0.051,0.999 c-1.671-0.138-4.775-0.28-8.359-0.089c-0.089,0.336-0.197,0.663-0.325,0.98c3.546,0.046,6.665,0.389,8.548,0.689 c-0.043,0.332-0.093,0.661-0.151,0.987c-1.912-0.306-5.171-0.664-8.879-0.682C35.112,30.873,31.557,32.75,26,32.969V33 c2.6,0,5,3.9,5,6.6V45c0,0.823,0.498,1.53,1.209,1.836C41.37,43.804,48,35.164,48,25C48,12.318,37.683,2,25,2S2,12.318,2,25 C2,35.164,8.63,43.804,17.791,46.836z"></path>
        </svg>
        cosmicchimp
      </div>
    </div>
  );
}

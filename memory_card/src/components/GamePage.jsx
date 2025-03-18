import { useState, useEffect } from "react";
import pokeball from "../../public/assets/pokeball.png";

export function GamePage({
  diffLevel,
  updateLoseStatus,
  updateWinStatus,
  highscore,
  updateHighscore,
}) {
  const [pokeCardData, updateCardData] = useState([]);
  const [score, updateScore] = useState(0);
  const [clickedCards, updateClickedCards] = useState([]);

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
    const clickedPokemon = e.currentTarget.id; // Ensures correct id
    if (
      !clickedCards.includes(clickedPokemon) &&
      clickedCards.length == pokeCardData.length - 1
    ) {
      updateScore((prev) => prev + 1);
      alert("You won!");
    } else if (clickedCards.includes(clickedPokemon)) {
      updateCardData((prev) => shuffleArray(prev));
      alert("You lost");
      updateLoseStatus(true);
    } else {
      updateClickedCards((prev) => [...prev, clickedPokemon]);
      updateScore((prev) => prev + 1);
      updateCardData((prev) => shuffleArray(prev)); // Shuffle after a successful click
    }
  }

  async function getPokemon(numOfPokemon) {
    let rawPokeJson = [];
    for (let i = 0; i < numOfPokemon; i++) {
      let randomNum = Math.floor(Math.random() * 900);
      rawPokeJson.push(
        fetch(`https://pokeapi.co/api/v2/pokemon/${randomNum}`).then((res) =>
          res.json()
        )
      );
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
      <div className="titleBox">
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
            className="pokemonCard"
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
    </div>
  );
}

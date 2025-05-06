import { useCallback, useEffect, useState } from "react"
import words from "./wordList.json"
import { HangmanDrawing } from "./HangmanDrawing"
import { HangmanWord } from "./HangmanWord"
import { Keyboard } from "./Keyboard"

function getWord(){
  return words[Math.floor(Math.random() * words.length)]
}

function App() {
  const [wordToGuess, setWordToGuess] = useState(getWord)

  const [guessedLetters, setGuessedLetters] = useState<string[]>([])

  const incorrectLetters = guessedLetters.filter(letter => !wordToGuess.includes(letter))

  const isLoser = incorrectLetters.length >= 6
  // Check every letter in word is guessed
  const isWinner = wordToGuess.split("").every(letter => guessedLetters.includes(letter))

  // Means the function is only re-running when guessedLetters array changes
  const addGuessedLetter = useCallback((letter: string) => {
    if (guessedLetters.includes(letter) || isWinner || isLoser) return

    setGuessedLetters(currentLetters => [...currentLetters, letter])
  }, [guessedLetters, isWinner, isLoser])


  // Allows user to use actual keyboard rather than visual one on screen

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const key = e.key

      // Check if key pressed was a letter - if not, then ignore
      if (!key.match(/^[a-z]$/)) return

      e.preventDefault()
      addGuessedLetter(key)
    }
    document.addEventListener("keypress", handler)

    return () => {
      document.removeEventListener("keypress", handler)
    }
  }, [guessedLetters])


  // Generate new word when user presses 'Enter'

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const key = e.key

      // Check if key pressed was a letter - if not, then ignore
      if (key != "Enter") return

      e.preventDefault()
      setGuessedLetters([])
      setWordToGuess(getWord())
    }
    document.addEventListener("keypress", handler)

    return () => {
      document.removeEventListener("keypress", handler)
    }
  }, [guessedLetters])

  console.log(wordToGuess)

  
  return (
    <div style={{
      maxWidth: "800px",
      display: "flex",
      flexDirection: "column",
      gap: "2rem",
      margin: "0 auto",
      alignItems: "center"
    }}>

      <div style={{ fontSize: "2rem", textAlign: "center" }}>
        {isLoser && "Nice try - Refresh to try again"}
        {isWinner && "Winner! Refresh to try again!"}
      </div>

      <HangmanDrawing numberOfGuesses={incorrectLetters.length} />
      <HangmanWord reveal={isLoser} guessedLetters={guessedLetters} wordToGuess={wordToGuess} />
      <div style={{ alignSelf: "stretch" }}>
        <Keyboard
        // Disallow user from continuing to select letters after win or loss
          disabled={isWinner || isLoser}
          activeLetters={guessedLetters.filter(letter => wordToGuess.includes(letter))}
          inactiveLetters={incorrectLetters}
          addGuessedLetter={addGuessedLetter}
        />
      </div>

    </div>
  )
}

export default App

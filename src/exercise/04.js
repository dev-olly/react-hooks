// useState: tic tac toe
// http://localhost:3000/isolated/exercise/04.js

import * as React from 'react'

function useLocalStorage(key, initialValue = Array(9).fill(null)) {
  const [state, setState] = React.useState(
    () => JSON.parse(localStorage.getItem(key)) || initialValue,
  )

  React.useEffect(() => {
    localStorage.setItem(key, JSON.stringify(state))
  }, [state])

  return [state, setState]
}

function Board({squares, selectSquare, restartGame}) {
  // 🐨 squares is the state for this component. Add useState for squares

  // 🐨 We'll need the following bits of derived state:
  // - nextValue ('X' or 'O')
  // - winner ('X', 'O', or null)
  // - status (`Winner: ${winner}`, `Scratch: Cat's game`, or `Next player: ${nextValue}`)
  // 💰 I've written the calculations for you! So you can use my utilities
  // below to create these variables

  // This is the function your square click handler will call. `square` should
  // be an index. So if they click the center square, this will be `4`.

  function renderSquare(i) {
    return (
      <button className="square" onClick={() => selectSquare(i)}>
        {squares[i]}
      </button>
    )
  }

  return (
    <div>
      {/* 🐨 put the status in the div below */}
      <div className="board-row">
        {renderSquare(0)}
        {renderSquare(1)}
        {renderSquare(2)}
      </div>
      <div className="board-row">
        {renderSquare(3)}
        {renderSquare(4)}
        {renderSquare(5)}
      </div>
      <div className="board-row">
        {renderSquare(6)}
        {renderSquare(7)}
        {renderSquare(8)}
      </div>
      <button className="restart" onClick={restartGame}>
        restart
      </button>
    </div>
  )
}

function Game() {
  const [history, setHistory] = useLocalStorage('history', [
    {squares: Array(9).fill(null)},
  ])
  const [step, setStep] = useLocalStorage('step', history.length - 1)
  const currentSquare = history[step].squares

  const nextValue = calculateNextValue(currentSquare)
  const winner = calculateWinner(currentSquare)
  const status = calculateStatus(winner, currentSquare, nextValue)

  const handleSquareClick = square => {
    if (currentSquare[square]) return
    //
    const squaresCopy = [...currentSquare]
    squaresCopy[square] = nextValue
    setHistory([...history.slice(0, step + 1), {squares: [...squaresCopy]}])

    setStep(step + 1)
  }

  function restart() {
    setHistory([{squares: Array(9).fill(null)}])
    setStep(0)
  }

  function moveHistory(step) {
    setStep(step)
  }
  return (
    <div className="game">
      <div className="game-board">
        <Board
          squares={currentSquare}
          selectSquare={handleSquareClick}
          restartGame={restart}
        />
      </div>
      <div className="game-info">
        <div>
          {status} -- {step}
        </div>
        <ol>
          {/* 🐨 put the moves in the ol below */}
          {history.map((point, move) => (
            <li key={move}>
              <button
                onClick={() => moveHistory(move)}
                disabled={move === step}
              >
                {move ? `Go to move ${move}` : 'Go to game start'}
              </button>
            </li>
          ))}
        </ol>
      </div>
    </div>
  )
}

// eslint-disable-next-line no-unused-vars
function calculateStatus(winner, squares, nextValue) {
  return winner
    ? `Winner: ${winner}`
    : squares.every(Boolean)
    ? `Scratch: Cat's game`
    : `Next player: ${nextValue}`
}

// eslint-disable-next-line no-unused-vars
function calculateNextValue(squares) {
  return squares.filter(Boolean).length % 2 === 0 ? 'X' : 'O'
}

// eslint-disable-next-line no-unused-vars
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ]
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i]
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a]
    }
  }
  return null
}

function App() {
  return <Game />
}

export default App

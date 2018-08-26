import React from 'react'
import ReactDOM from 'react-dom'
import { createStore, combineReducers } from 'redux'
import './App.css'

// redux reducers:
const gameboard = (state = [null, null, null, null, null, null, null, null, null], action) => {
  switch (action.type) {
    case 'PLACE_MARKER':
      return state.map((x, i) =>
        i === action.positon ? action.marker : x)
    case 'RESTART_GAME':
      return state.map(x => null)
    default:
      return state
  }
}

const currentPlayer = (state = 'X', action) => {
  switch (action.type) {
    case 'SWITCH_PLAYER':
      return state === 'X' ? 'O' : 'X'
    default:
      return state
  }
}

const game = combineReducers({gameboard, currentPlayer})
const store = createStore(game)

// React Components
const Square = ({marker, onclick}) =>
  <div
    className="square"
    onClick={() => onclick()}
    >{marker}</div>

const gameStatus = board => {
  const winConditions = [[0, 1, 2],
                         [3, 4, 5],
                         [6, 7, 8],
                         [0, 3, 6],
                         [1, 4, 7],
                         [2, 5, 8],
                         [0, 4, 8],
                         [2, 4, 6]]
  if (board.every(x => x)) return {win: false}
  return winConditions.reduce((win, c) => {
    if (!board[c[0]]) return win
    if (board[c[0]] === board[c[1]] &&
        board[c[0]] === board[c[2]]) {
      return {win: true, winner: board[c[0]]}
    };
    return win
  }, {win: false, winner: null})
}

const Board = ({board}) => {
  return (
    <div className="board">
      {board.map((x, i) =>
        <Square
          marker={x}
          key={i}
          onclick={() => {
            if (!board[i] && !gameStatus(board).win) {
              store.dispatch({
                type: 'PLACE_MARKER',
                positon: i,
                marker: store.getState().currentPlayer
              })
              store.dispatch({type: 'SWITCH_PLAYER'})
            }
          }
          }
        />
      )}
    </div>
  )
}

const Gameover = ({board}) => {
  if (gameStatus(board).win) {
    return (
      <div>
        <h1>GAMEOVER DUDE</h1>
        <h2>winner is {gameStatus(board).winner}</h2>
        <RestartButton />
      </div>
    )
  } else if (gameStatus(board).tie) {
    return (
      <div>
        <h1>GAMEOVER DUDE</h1>
        <h2>it was a tie</h2>
        <RestartButton />
      </div>
    )
  }
  return <div></div>
}

const RestartButton = props => {
  return (
    <button
      onClick={() =>
        store.dispatch({
          type: 'RESTART_GAME'
        })
      }
    >RESTART GAME</button>
  )
}

const Title = props => <h1>tictactoe</h1>

const App = props => {
  return (
    <div>
      <Title />
      <Board board={store.getState().gameboard} />
      <Gameover board={store.getState().gameboard}/>
    </div>
  )
}

const render = () => {
  ReactDOM.render(
    <App />,
    document.getElementById('root')
  )
}

store.subscribe(render)
export default App

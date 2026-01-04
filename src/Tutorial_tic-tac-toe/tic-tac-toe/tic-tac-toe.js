import "./tic-tac-toe.css";
import { useState } from "react";

/*
To practice your new React skills, here are some ideas for improvements that you could make to the tic-tac-toe game, 
listed in order of increasing difficulty:

1. For the current move only, show “You are at move #…” instead of a button.
2. Rewrite Board to use two loops to make the squares instead of hardcoding them.
3. Add a toggle button that lets you sort the moves in either ascending or descending order.
4. When someone wins, highlight the three squares that caused the win (and when no one wins, display a message about the result being a draw).
5. Display the location for each move in the format (row, col) in the move history list.
*/

function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

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
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[b] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (squares[i] || calculateWinner(squares)) return;
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }
    onPlay(nextSquares);
  }
  let winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = "Winner: " + winner;
  } else {
    status = "Next Player: " + (xIsNext ? "X" : "O");
  }

  return (
    <>
      <div className="status">{status}</div>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </>
  );
}

export default function Game() {
  // const [xIsNext, setXisNext] = useState(true);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove %2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove+1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length-1);
    //setXisNext(!xIsNext);
  }

  function jumpTo(nextMove){
    setCurrentMove(nextMove);
    //setXisNext(nextMove%2 === 0);
  }

  const moves = history.map((squares, move)=>{
    let description;
    if(move > 0){
      description = "Go to Move #" + move;
    }else{
      description = "Go to Game Start";
    }
    return(
      <li key={move}>
        {currentMove === move ? <p>You are at move # {move}</p> : <button onClick={() => jumpTo(move)}>{description}</button>}
      </li>
    )
  });

  return (
    <>
      <div className="game">
        <div className="game-board">
          <Board
            xIsNext={xIsNext}
            squares={currentSquares}
            onPlay={handlePlay}
          />
        </div>
        <div className="game-info">
          <ol>{moves}</ol>
        </div>
      </div>
    </>
  );
}
/*
- In React, a component is a piece of reusable code that represents a part of a user interface. 
Components are used to render, manage, and update the UI elements in your application.
- The return JavaScript keyword means whatever comes after is returned as a value to the caller 
of the function.
- A JSX element is a combination of JavaScript code and HTML tags that describes what you’d like 
to display.
- Index.js ->  it is the bridge between the component you created in the App.js file and the web browser.
- React components need to return a single JSX element and not multiple adjacent JSX elements like two buttons. 
To fix this you can use fragments (<> and </>) to wrap multiple adjacent JSX elements
*/

// Passing Data through Props
/*
- use props to pass the value each square should have from the parent component (Board) to its child (Square).
- Note how unlike the browser divs, your own components Board and Square must start with a capital letter.
- function Square({ value }) indicates the Square component can be passed a prop called value.
- To “escape into JavaScript” from JSX, you need curly braces. Add curly braces around value in JSX like so.
- To pass data add the value prop to each Square component rendered by the Board component.
*/

// Making an Interative Component
/*
- React provides a special function called useState that you can call from your component to let it “remember” things. 
- value stores the value and setValue is a function that can be used to change the value. The null passed to useState 
is used as the initial value for this state variable, so value here starts off equal to null.
- By calling this set function from an onClick handler, you’re telling React to re-render that Square whenever its 
<button> is clicked. After the update, the Square’s value will be 'X', so you’ll see the “X” on the game board. 
Click on any Square, and “X” should show up
- Each Square has its own state: the value stored in each Square is completely independent of the others. When you 
call a set function in a component, React automatically updates the child components inside too.
*/

// lifting State Up
/*
- To collect data from multiple children, or to have two child components communicate with each other, declare the 
shared state in their parent component instead. The parent component can pass that state back down to the children 
via props. This keeps the child components in sync with each other and with their parent.
- Lifting state into a parent component is common when React components are refactored.
*/

// Why immutability is important
/*
- Immutability makes complex features much easier to implement. An ability to undo and redo certain actions is a 
common requirement for apps. Avoiding direct data mutation lets you keep previous versions of the data intact, 
and reuse them later.
- There is also another benefit of immutability. By default, all child components re-render automatically when 
the state of a parent component changes. This includes even the child components that weren’t affected by the 
change. Although re-rendering is not by itself noticeable to the user (you shouldn’t actively try to avoid it!), 
you might want to skip re-rendering a part of the tree that clearly wasn’t affected by it for performance reasons. 
Immutability makes it very cheap for components to compare whether their data has changed or not. 
*/

// Adding time travel
// Picking a Key
/* React is a computer program and can’t know what you intended, so you need to specify a key property for each list 
item to differentiate each list item from its siblings.*/

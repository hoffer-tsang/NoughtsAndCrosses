import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import useAuth from "../hooks/useAuth";
import * as WebSocketProvider from "../context/WebSocketProvider";
import styles from "../css/style.css";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

const client = WebSocketProvider.WebSocketServer;

function Square({ value, onSquareClick }){
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay, currentPlayer, newGame }) {

  function handleClick(i) {
    if (squares[i] || calculateWinner(squares)) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }
    onPlay(nextSquares);
  }
    
  const winner = calculateWinner(squares);
  const isDraw = calcualteDraw(squares);
  let displayRestart = false;
  let status;
  if (winner) {
    status = "Winner: " + winner;
    displayRestart = true
  } else if (isDraw)
  {
    status = "Draw, play another game?";
    displayRestart = true;
  } else {
    status = "Next player: " + currentPlayer; //(xIsNext ? "X" : "O");
  }

  function restart()
  {
    if (winner || isDraw){
      newGame();
    }
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
      <br/>
      {displayRestart ?
      (<div>
        <button className="btn btn-primary" id="playAgainBtn" onClick={restart}> Play Again </button>
      </div>) :
      (<br/>)
      }
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const [userName, setUserName] = useState('');
  const [players, setPlayers] = useState([]);
  const [playerTurn, setPlayerTurn] = useState(0);
  const [show, setShow] = useState(false);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];
  const { auth, setAuth } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const roomId = location.state.roomId;
  const intPlayerList = location.state.players;

  const handleClose = () => setShow(false);
  const quitRoom = () => {
    setAuth({user: auth?.user});
    navigate('/dashboard', {replace: true});
  }

  useEffect(() => {
    setUserName(auth?.user);
    playerInGame(intPlayerList);
  }, []);

  function handlePlay(nextSquares) {
    if (players.length == 2)
    {
      if (userName == players[playerTurn])
      {
        let newPlayerTurn = 0;
        if(playerTurn == 0)
        {
          setPlayerTurn(1);
          newPlayerTurn = 1
        }
        else{
          setPlayerTurn(0);
          newPlayerTurn = 0
        }
        client.send(JSON.stringify({
          type: "gamePlay",
          roomId: roomId,
          nextSquare: nextSquares,
          user: userName,
          playerTurn: newPlayerTurn
        })); 
      }
    }
  }

  function newGame()
  {
    const playerList = [];
    playerList.push(players[1]);
    playerList.push(players[0]);
    client.send(JSON.stringify({
      type: "restartGame",
      roomId: roomId,
      players: playerList
    })); 
  }

  client.onmessage = (message) => {
    const dataFromServer = JSON.parse(message.data);
    console.log("got reply! ", dataFromServer);
    if (dataFromServer.type === "gamePlay"){
      const nextHistory = [...history.slice(0, currentMove + 1), dataFromServer.nextSquare];
      setHistory(nextHistory);
      setCurrentMove(nextHistory.length - 1);
      setPlayerTurn(dataFromServer.playerTurn)
    }
    else if (dataFromServer.type === "joinGame"){
      playerInGame(dataFromServer.players);
    }
    else if(dataFromServer.type === "restartGame")
    {
      setHistory([Array(9).fill(null)]);
      setCurrentMove(0);
      playerInGame(dataFromServer.players);
      setPlayerTurn(0);
    }
    else if (dataFromServer.type === "opponentQuit"){
      setShow(true);
    }
  };

  function playerInGame(intUserList){
    let userList = [];
    for (let i = 0; i < intUserList.length; i++)
    {
      userList.push(Object.values(intUserList[i]));
    }
    setPlayers(userList);
  }

  function Quit(){
    let leftUser = "";
    for (let i = 0; i < players.length; i++)
    {
      if (players[i] != userName)
      {
        leftUser = players[i];
      }
    }
    client.send(JSON.stringify({
      type: "quitRoom",
      roomId: roomId,
      leftUser: leftUser,
    })); 
    setAuth({user: auth?.user});
    navigate('/dashboard', {replace: true});
  }

  function NoughtsAndCrosses(){
    return(
      <div className="game">
        <div className="container">
          <div className='row'>
            <div className='col'>
              Room Id: {roomId}
            </div>
          </div>
          <div className='row py-3'>
            <div className='col'>
              Player: {userName}
            </div>
          </div>
          <div className="row py-3">
            <div className="col">
              <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} currentPlayer={players[playerTurn]} newGame={newGame} />
            </div>
          </div>
          <div className="row py-2">
            <div className="col">
              <button className="btn btn-primary" onClick={Quit}>Quit Game</button>
            </div>
          </div>
        </div>
      </div>    
    )
  }

  return (
    <>
      <div>
      <NoughtsAndCrosses className={styles} />
      </div>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Game Status</Modal.Title>
        </Modal.Header>
        <Modal.Body>Your opponent left, want to quit this game?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            No
          </Button>
          <Button variant="primary" onClick={quitRoom}>
            Yes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
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
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

function calcualteDraw(squares) {
    for (let i = 0; i < squares.length; i++) {
      if (squares[i] == null){
        return null;
      }
    }
    return true;
}

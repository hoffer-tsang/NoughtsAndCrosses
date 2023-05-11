import useAuth from "../hooks/useAuth";
import { useRef, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import * as WebSocketProvider from "../context/WebSocketProvider";
import styles from "../css/style.css";

const client = WebSocketProvider.WebSocketServer;

function Dashboard (){

    const { auth, setAuth } = useAuth();
    const [roomId, setRoomId] = useState("");
    const [errorMessage, setErrorMessage] = useState('');
    const [onlineUser, setOnlineUser] = useState([]);
    const [show, setShow] = useState(false);
    const [challenger, setChallenger] = useState("");
    const [challengeRoomId, setChallengeRoomId] = useState("");

    const handleClose = () => setShow(false);
    const joinChallenge = () => {
        setShow(false);
        client.send(JSON.stringify({
            type: "joinGame",
            roomId: challengeRoomId,
            player: auth?.user
          }));
    }

    const roomIdRef = useRef();
    const errorRef = useRef();
    const navigate = useNavigate();

    useEffect(() => {
        roomIdRef.current.focus();
        client.send(JSON.stringify({
            type: "login",
            player: auth?.user
          }))
    }, []);

    useEffect(() => {
        setErrorMessage('');
    }, [roomId]);

    client.onmessage = (message) => {
        const dataFromServer = JSON.parse(message.data);
        console.log("got reply! ", dataFromServer);
        if (dataFromServer.type === 'error')
        {
            setErrorMessage(dataFromServer.errorMessage);
            errorRef.current.focus();
        } 
        else if (dataFromServer.type === 'newGame' || dataFromServer.type === 'joinGame')
        {
            setAuth({user: auth?.user});
            navigate('/app', {state: {roomId: dataFromServer.roomId, players: dataFromServer.players}});
        }
        else if (dataFromServer.type === 'login')
        {
            let newUserList = [];
            Object.values(dataFromServer.players).forEach(val => newUserList.push(val));
            setOnlineUser(newUserList);
            console.log(newUserList);
        }
        else if (dataFromServer.type === 'challengeMessage')
        {
            setShow(true);
            setChallengeRoomId(dataFromServer.roomId);
            setChallenger(dataFromServer.challenger)
        }
    };

    function NewGame(e)
    {
        e.preventDefault();
        client.send(JSON.stringify({
            type: "newGame",
            player: auth?.user
          })); 
    }

    function JoinGame(e)
    {
        e.preventDefault();
        client.send(JSON.stringify({
            type: "joinGame",
            roomId: roomId,
            player: auth?.user
          }));
    }

    function Challenge({user})
    {
        const challengePlayer = (user) => {
            client.send(JSON.stringify({
                type: "newChallenge",
                player: auth?.user,
                challenger: user
            }));
        };

        if (user === auth?.user)
        {
            return <div>-</div>;
        }
        else {
            return <button className="btn btn-primary" onClick={() => challengePlayer(user)}>Challenge</button>;
        }
    }

    return (
        <div className={styles}>
            <h1>
                Welcome Back {auth?.user}
            </h1>
            <h1>
                Want a game of Noughts And Crosses?
            </h1>
            <div>
                <button className="btn btn-primary" onClick= { (e) => NewGame(e)}>New Game</button>
            </div>
            < br/>
            <h3> Join Game</h3>
            <p ref={errorRef} className={errorMessage? "errmsg" : "offscreen"} aria-live="assertive">{errorMessage}</p>
            <form onSubmit={JoinGame}>
                <label htmlFor="roomId">Room Id:</label>
                <input 
                    type="text"
                    id="roomId"
                    autoComplete="off"
                    ref={roomIdRef}
                    onChange={(e) => setRoomId(e.target.value)}
                    value={roomId}
                    required
                />
                <br />
                <button className="btn btn-primary">Join</button>
            </form>
            <h3>Online Player:</h3>
            <table className="table table-striped table-bordered">
                <thead>
                    <tr>
                        <th>User</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {onlineUser.map((user,index) =>
                        <tr key={index}>
                            <td>{user}</td>
                            <td><Challenge user={user}/></td>
                        </tr>)}
                </tbody>
            </table>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>New Challenge</Modal.Title>
                </Modal.Header>
                <Modal.Body>Accept Challenge from {challenger}?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        No
                    </Button>
                    <Button variant="primary" onClick={joinChallenge}>
                        Yes
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default Dashboard
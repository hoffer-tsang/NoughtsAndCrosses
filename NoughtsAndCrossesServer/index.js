const webSocketsServerPort = 8000;
const webSocketServer = require('websocket').server;
const http = require('http');

const server = http.createServer();
server.listen(webSocketsServerPort);
console.log('listening on port 8000');

const wsServer = new webSocketServer({
    httpServer: server
});

// I'm maintaining all active connections in this object
const clients = {};
// I'm maintaining all active users in this object
const gameUser = {};
const users = {};

const typesDef = {
    USER_EVENT: 'userevent',
    CONTENT_CHANGE: 'contentchange'
  }

const getUniqueId = () => {
    const s4 = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    return s4() + s4() + '-' + s4();
};

function broadcastMessage(json, userList) {
    // We are sending the current data to all connected clients
    const data = JSON.stringify(json);
    console.log(userList);
    if (userList == null)
    {
        for(let userId in clients) {
            let client = clients[userId];
            client.send(data);
        };
    } else
    {
        for(let i = 0; i < userList.length; i++) {
            let client = clients[userList[i]];
            client.send(data);
        };
    }
    
  }
  
  function handleDisconnect(userId) {
      console.log(`${userId} disconnected.`);
      console.log(gameUser);
      const json = { type: typesDef.USER_EVENT };
      json.data = { players: users };
      delete clients[userId];
      delete users[userId];
      broadcastMessage(json, null);
  }

wsServer.on('request', function(request){
    var userID = getUniqueId();

    const connection = request.accept(null, request.origin);
    clients[userID] = connection;

    connection.on('message', function(message){
        const dataFromClient = JSON.parse(message.utf8Data.toString());
        if (dataFromClient.type === 'login')
        {
            users[userID] = dataFromClient.player;
            const json = {
                type: "login",
                players: users
              };
            broadcastMessage(json, null);
        } else if (dataFromClient.type === 'newGame')
        {
            let roomId = getUniqueId();
            gameUser[roomId]= [{ [userID]: dataFromClient.player}]
            let userList = [];
            userList.push(userID)   
            const json = {
                type: "newGame",
                roomId: roomId,
                players: gameUser[roomId]
              };
            broadcastMessage(json, userList);
        } else if (dataFromClient.type === 'quitRoom')
        {
            let roomId = dataFromClient.roomId;
            let leftUser = dataFromClient.leftUser
            let leftUserId = '';
            for (key in gameUser[roomId])
            {
                const tempUser = Object.values(gameUser[roomId][key]);
                if (tempUser.toString() === leftUser.toString())
                {
                    leftUserId = Object.keys(gameUser[roomId][key]);
                }
            }
            console.log(leftUserId);
            delete gameUser[roomId];
            if (leftUserId != ''){
                let userList = [];
                userList.push(leftUserId);
                const json = {
                    type: "opponentQuit",
                };
                broadcastMessage(json, userList);  
            }
        } else if (dataFromClient.type === 'newChallenge')
        {
            let roomId = getUniqueId();
            gameUser[roomId]= [{ [userID]: dataFromClient.player}]
            let userList = [];
            userList.push(userID)   
            const json = {
                type: "newGame",
                roomId: roomId,
                players: gameUser[roomId]
              };
            broadcastMessage(json, userList);
            const challenger = dataFromClient.challenger
            for (key in users)
            {
                if (users[key] === challenger)
                {
                    const json = {
                        type: "challengeMessage",
                        challenger: dataFromClient.player,
                        roomId: roomId,
                      };
                    let userList = [];
                    userList.push(key)   
                    broadcastMessage(json, userList);
                }
            }
        } else if (dataFromClient.type === 'joinGame')
        {
            let roomId = dataFromClient.roomId;
            let roomIdExist = false;
            for (key in gameUser)
            {
                if (key == roomId)
                {
                    roomIdExist = true;
                    break;
                }
            }
            if (!roomIdExist)
            {
                const json = {
                    type: "error",
                    errorMessage: "Room Id Not Found"
                  };
                let userList = [];
                userList.push(userID);
                broadcastMessage(json, userList);
            } else if (gameUser[roomId].length >= 2){
                const json = {
                    type: "error",
                    errorMessage: "Room is full already"
                  };
                let userList = [];
                userList.push(userID);
                broadcastMessage(json, userList);
            }
            else 
            {
                gameUser[roomId].push({ [userID]: dataFromClient.player});
                let userList = [];
                for (i = 0; i < gameUser[roomId].length; i++)
                {
                    for (key in gameUser[roomId][i])
                    {
                        userList.push(key)
                    }
                }
                const json = {
                    type: "joinGame",
                    roomId: roomId,
                    players: gameUser[roomId]
                };
                broadcastMessage(json, userList);
            }
        } else if (dataFromClient.type === 'gamePlay' || dataFromClient.type === 'restartGame')
        {       
            let roomId = dataFromClient.roomId;
            let userList = [];
            for (i = 0; i < gameUser[roomId].length; i++)
            {
                for (key in gameUser[roomId][i])
                {
                    userList.push(key)
                }
            }
            broadcastMessage(dataFromClient, userList);    
        }
    }) 

    // User disconnected
    connection.on('close', () => handleDisconnect(userID));
});


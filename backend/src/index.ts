import { WebSocketServer, WebSocket } from "ws";

interface User {
    socket: WebSocket;
    room: string;
}

let allSockets: User[] = [];

const wss = new WebSocketServer({
    port: 8080
});

//check connection
wss.on("connection", (socket) => {
    console.log("A user connected");

    //check for message
    socket.on("message", (message) => {
        const parsedMessage = JSON.parse(message.toString());

        //check for join/chat
        if (parsedMessage.type === "join") {
            allSockets.push({
                socket,
                room: parsedMessage.payload.roomId
            });
        }

        if (parsedMessage.type === "chat") {
            const currentUser = allSockets.find(
                (user) => user.socket === socket
            );

            if (!currentUser) {
                return;
            }

            //loop through array of users, and send 
            // the message in a particular room for all users
            for (const user of allSockets) {
                if (user.room === currentUser.room) {
                    user.socket.send(parsedMessage.payload.message);
                }
            }
        }
    });

    //when connection disconnects,
    //dont send message to that socket/user
    socket.on("close", () => {
        allSockets = allSockets.filter(
            (user) => user.socket !== socket
        );

        console.log("A user disconnected");
    });
});
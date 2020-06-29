
const WebSocketServer = require('ws')
const { parse } = require('path')

// import WebSocket from "ws"

// Create a WebSocket server by defining its port number.
const server = new WebSocketServer.Server({ port: 3333 })

const botManager = new Map()
const userManager = new Map()

server.on('connection', connection => {

    // console.log(connection)
    // Listen for incoming messages and run the defined
    // callback function when a messages comes in. 
    connection.on('message', (message) => {

        // console.log(message);
        console.log(JSON.parse(message));

        //? Message parser:
        const parsedMessage = JSON.parse(message)

        //?Identify Message type
        //! MessageTypes
        switch (parsedMessage.doFunction) {
            //!Register Bots
            case "NEW bot":
                if (parsedMessage.register) {
                    if (!botManager.get(parsedMessage.bot_id)) {
                        botManager.set(parsedMessage.bot_id, connection)
                    }
                }
                break;
            //!GetBots (MainBot only via "/websocket" API)
            case "GET bots":
                if (parsedMessage.bot_id === "connectionMainBot") {
                    let conn = botManager.get(parsedMessage.bot_id)
                    conn.send(JSON.stringify(`Anzahl registrierter Bots: ${botManager.size}`))
                }
                break;
             //!Push new Ads to Users
            case "PUSH Ads":
                server.clients.forEach((client) => {
                    if (client.readyState === WebSocketServer.OPEN) {
                        client.send(JSON.stringify({ handleServerAction: "fetchLocations" }))
                    }
                })
            //!Register New/LoggedIn User
            case "NEW User":
                    if (parsedMessage.register) {
                        if (!userManager.get(parsedMessage.username)) {
                            userManager.set(parsedMessage.username, connection)
                            connection.send(JSON.stringify({topic:"Willkommen",message:`Hallo ${parsedMessage.username}, schön, dass Sie hier sind`}))
                        }
                }
            default:
                console.log("Unbekannte Handlung")
                break;
        }
    })
})
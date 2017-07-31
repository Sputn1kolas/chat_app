// server.js

const express = require('express');
const SocketServer = require('ws').Server;
const WebSocket = require('ws');


// creates UID for each message
const uuidv1 = require('uuid/v1');

// fake db
messages_db = []

// Set the port to 3001
const PORT = 3001;

// Create a new express server
const server = express()
   // Make the express server serve static assets (html, javascript, css) from the /public folder
  .use(express.static('public'))
  .listen(PORT, '0.0.0.0', 'localhost', () => console.log(`Listening on ${ PORT }`));

// Create the WebSockets server
const wss = new SocketServer({ server });


// Set up a callback that will run when a client connects to the server
// When a client connects they are assigned a socket, represented by
// the ws parameter in the callback.

wss.on('connection', function connection(ws) {
  console.log("client connected")
  console.log("numOnlineUsers:", wss.clients.size)
  newMessage  = {
    type: "inChat",
    inChat: wss.clients.size
  }
  wss.clients.forEach(function each(client) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(newMessage));
    }
  })

// sends message to everyone
  ws.on('message', function incoming(message) {
    let message_object = JSON.parse(message)
    switch(message_object["type"]){
      case "message":
        message_object["id"] = uuidv1()
        messages_db.push(message_object)
        wss.clients.forEach(function each(client) {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(message_object));
          }
        })
        break;
      case "notification":
        wss.clients.forEach(function each(client) {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(message_object));
          }
        })
        break;
    }
  });

  // Set up a callback for when a client closes the socket. This usually means they closed their browser.
  ws.on('close', () => {
    console.log('Client disconnected')
    console.log("numOnlineUsers:", wss.clients.size)
    newMessage  = {
      type: "inChat",
      inChat: wss.clients.size
    }
    wss.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(newMessage));
      }
    })
  });
})
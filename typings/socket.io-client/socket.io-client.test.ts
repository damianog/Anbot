/// <reference path="socket.io-client.d.ts" />

import socketio = require("socket.io-client");

var socket = socketio("", {});
var protocol = socketio.protocol;

var manager = socketio.Manager("", {});
manager
    .reconnection(true)
    .reconnectionAttempts(3)
    .reconnectionDelay(1000)
    .reconnectionDelayMax(5000)
    .timeout(20000)
    .timeout(false);

var reconnection:boolean = manager.reconnection();
var reconnectionAttempts:number = manager.reconnectionAttempts();
var reconnectionDelay:number = manager.reconnectionDelay();
var reconnectionDelayMax:number = manager.reconnectionDelayMax();

var timeout:number = manager.timeout();
var timeoutDisabled:boolean = manager.timeout<boolean>();



var socket1 = io();
var socket2 = io("");
var socket3 = io("",{});

socket1.on("connection", (socket) =>{
    console.log("a user connected");

    socket1.emit("event", {  } ,() => {
    });

    socket1.on("disconnect", () => {
        console.log("user disconnected");
    });
});



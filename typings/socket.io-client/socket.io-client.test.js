/// <reference path="socket.io-client.d.ts" />
var socketio = require("socket.io-client");

var socket = socketio("", {});
var protocol = socketio.protocol;

var manager = socketio.Manager("", {});
manager.reconnection(true).reconnectionAttempts(3).reconnectionDelay(1000).reconnectionDelayMax(5000).timeout(20000).timeout(false);

var reconnection = manager.reconnection();
var reconnectionAttempts = manager.reconnectionAttempts();
var reconnectionDelay = manager.reconnectionDelay();
var reconnectionDelayMax = manager.reconnectionDelayMax();

var timeout = manager.timeout();
var timeoutDisabled = manager.timeout();

var socket1 = io();
var socket2 = io("");
var socket3 = io("", {});

socket1.on("connection", function (socket) {
    console.log("a user connected");

    socket1.emit("event", {}, function () {
    });

    socket1.on("disconnect", function () {
        console.log("user disconnected");
    });
});
//# sourceMappingURL=socket.io-client.test.js.map

/// <reference path="typings/anbot-server.d.ts" />
import fs = require("fs");
import path = require("path");
import compression =  require("compression");
import http = require("http");
import express = require("express");
import socketio = require("socket.io");

var app = express();
var srv = http.createServer(app);
var io = socketio.listen(srv);

app.set("port", process.env.PORT || 8080);
app.use(compression());
app.use(express.static(path.join(__dirname, "private")));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "shared")));

app.use("/administrator/*", (req, res)=> {
    res.sendFile(path.join(__dirname, "private", "administrator", "index.html"));
});

var routePath = "./routes/";
fs.readdirSync(routePath).forEach((file) => {
    if (path.extname(file) === ".js") {
        var route = path.join(__dirname, routePath, file);
        require(route).init(app);
    }
});

var server = srv.listen(app.get("port"), () => {
    console.log("Server listening on port " + server.address().port);
});
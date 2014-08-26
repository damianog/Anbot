/// <reference path="typings/anbot-server.d.ts" />
var fs = require("fs");
var path = require("path");
var compression = require("compression");
var http = require("http");
var express = require("express");
var socketio = require("socket.io");

var app = express();
var srv = http.createServer(app);
var io = socketio.listen(srv);

app.set("port", process.env.PORT || 8080);
app.use(compression());
app.use(express.static(path.join(__dirname, "private")));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "shared")));

app.use("/administrator/*", function (req, res) {
    res.sendFile(path.join(__dirname, "private", "administrator", "index.html"));
});

var routePath = "./routes/";
fs.readdirSync(routePath).forEach(function (file) {
    if (path.extname(file) === ".js") {
        var route = path.join(__dirname, routePath, file);
        require(route).init(app);
    }
});

var server = srv.listen(app.get("port"), function () {
    console.log("Server listening on port " + server.address().port);
});
//# sourceMappingURL=server.js.map

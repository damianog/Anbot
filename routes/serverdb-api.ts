/// <reference path="../typings/anbot-server.d.ts" />
import express = require("express");
import mongoose = require("mongoose");

interface ITempLog extends mongoose.Document {
    date:Date;
    temp:Number;
}

var Schema = mongoose.Schema;


var db = mongoose.createConnection("mongodb://localhost/anbot-log");

var TempLog = mongoose.model<ITempLog>("TempLog", new Schema({
    date: Date,
    temp: Number
}));

db.on("error", console.error);
db.once("open", () => {

});

function api(req:express.Request, res:express.Response, next:Function) {

    var action = (req.method + req.params.action).toLowerCase();

    switch (action) {
        case "getlog":
        {
            console.log(req.body);
            break;
        }
        default :
        {
            next();
            break;
        }
    }
}

export function init(app:express.Application) {
    app.use("/api/:action", api);
}


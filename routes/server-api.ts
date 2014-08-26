/// <reference path="../typings/anbot-server.d.ts" />
import express = require("express");
import fs = require("fs");
import path = require("path");
import mime = require("mime");

var rootFolder = process.cwd();

function getPathInfo(pathname:string):anbot.IFileInfo {
    var stats = fs.lstatSync(pathname);

    var info:anbot.IFileInfo = {
        path: pathname,
        name: path.basename(pathname)
    };

    if (stats.isDirectory()) {
        info.type = "folder";
        info.children = fs.readdirSync(pathname).map((child) => {
            return getPathInfo(path.join(pathname, child));
        });
    } else {
        info.type = "file";
        info.ext = path.extname(pathname);
        info.mime = mime.lookup(pathname);
    }
    return info;
}

function api(req:express.Request, res:express.Response, next:Function) {

    var action = (req.method + req.params.action).toLowerCase();

    switch (action) {
        case "getserverrestart":
        {
            console.log("Restarting...");
            res.end();
            process.exit(0);
            break;
        }
        case "getserverinfo":
        {
            res.json({
                "NodeVersion": process.version,
                "ExpressVersion": express().version
            });
            break;
        }
        case "getfiles" :
        {
            res.send(getPathInfo("public"));
            break;
        }
        case "getfile" :
        {
            var filename = req.query["path"];
            res.sendFile(filename, { root: rootFolder});
            break;
        }
        case "putfolder":
        {
            var pathname = req.query["path"];
            if (pathname) {
                if (!fs.existsSync(pathname)) {
                    fs.mkdir(pathname, (err) => {
                        if (err) {
                            throw err;
                        }
                    });
                }
            } else {
                res.end(400);
            }
            break;
        }
        case "putfile" :
        {
            var filename = req.query["path"];
            if (filename) {
                if (!fs.existsSync(filename)) {
                    req
                        .pipe(fs.createWriteStream(filename))
                        .on("finish", ()=> {
                            res.end();
                        });
                }
            } else {
                res.end(400);
            }
            break;
        }
        case "postfile" :
        {
            var filename = req.query["path"];
            if (filename) {
                req
                    .pipe(fs.createWriteStream(filename))
                    .on("finish", ()=> {
                        res.end();
                    });
            } else {
                res.end(400);
            }
            break;
        }
        case "deletefolder":
        {
            var pathname = req.query["path"];
            if (pathname) {
                fs.rmdir(pathname, (err) => {
                    if (err) {
                        throw err;
                    }
                    res.end();
                })
            } else {
                res.end(400);
            }
            break;
        }
        case "deletefile":
        {
            var filename = req.query["path"];
            if (filename) {
                fs.unlink(filename, (err) => {
                    if (err) {
                        throw err;
                    }
                    res.end();
                })
            } else {
                res.end(400);
            }
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
/// <reference path="../typings/anbot-server.d.ts" />
var express = require("express");
var fs = require("fs");
var path = require("path");
var mime = require("mime");

var rootFolder = process.cwd();

function getPathInfo(pathname) {
    var stats = fs.lstatSync(pathname);

    var info = {
        path: pathname,
        name: path.basename(pathname)
    };

    if (stats.isDirectory()) {
        info.type = "folder";
        info.children = fs.readdirSync(pathname).map(function (child) {
            return getPathInfo(path.join(pathname, child));
        });
    } else {
        info.type = "file";
        info.ext = path.extname(pathname);
        info.mime = mime.lookup(pathname);
    }
    return info;
}

function api(req, res, next) {
    var action = (req.method + req.params.action).toLowerCase();

    switch (action) {
        case "getserverrestart": {
            console.log("Restarting...");
            res.end();
            process.exit(0);
            break;
        }
        case "getserverinfo": {
            res.json({
                "NodeVersion": process.version,
                "ExpressVersion": express().version
            });
            break;
        }
        case "getfiles": {
            res.send(getPathInfo("public"));
            break;
        }
        case "getfile": {
            var filename = req.query["path"];
            res.sendFile(filename, { root: rootFolder });
            break;
        }
        case "putfolder": {
            var pathname = req.query["path"];
            if (pathname) {
                if (!fs.existsSync(pathname)) {
                    fs.mkdir(pathname, function (err) {
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
        case "putfile": {
            var filename = req.query["path"];
            if (filename) {
                if (!fs.existsSync(filename)) {
                    req.pipe(fs.createWriteStream(filename)).on("finish", function () {
                        res.end();
                    });
                }
            } else {
                res.end(400);
            }
            break;
        }
        case "postfile": {
            var filename = req.query["path"];
            if (filename) {
                req.pipe(fs.createWriteStream(filename)).on("finish", function () {
                    res.end();
                });
            } else {
                res.end(400);
            }
            break;
        }
        case "deletefolder": {
            var pathname = req.query["path"];
            if (pathname) {
                fs.rmdir(pathname, function (err) {
                    if (err) {
                        throw err;
                    }
                    res.end();
                });
            } else {
                res.end(400);
            }
            break;
        }
        case "deletefile": {
            var filename = req.query["path"];
            if (filename) {
                fs.unlink(filename, function (err) {
                    if (err) {
                        throw err;
                    }
                    res.end();
                });
            } else {
                res.end(400);
            }
            break;
        }
        default: {
            next();
            break;
        }
    }
}

function init(app) {
    app.use("/api/:action", api);
}
exports.init = init;
//# sourceMappingURL=server-api.js.map

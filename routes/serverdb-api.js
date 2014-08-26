var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var db = mongoose.createConnection("mongodb://localhost/anbot-log");

var TempLog = mongoose.model("TempLog", new Schema({
    date: Date,
    temp: Number
}));

db.on("error", console.error);
db.once("open", function () {
});

function api(req, res, next) {
    var action = (req.method + req.params.action).toLowerCase();

    switch (action) {
        case "getlog": {
            console.log(req.body);
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
//# sourceMappingURL=serverdb-api.js.map

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var express = require('express');
var fs = require('fs');
var path = require('path');
var _ = require('lodash');
var unirest = require("unirest");
//"https://data.ny.gov/api/views/5xaw-6ayf/rows.csv?accessType=DOWNLOAD&sorting=true";
var DATA_URL = process.env.DATA_URL.replace(/"/g, '');
console.log(process.env.DATA_URL);
var data = {};
var req = unirest.get(DATA_URL).then(function (res) {
    if (res.error)
        throw new Error(res.error);
    var _loop_1 = function () {
        var chunks = line.split(',');
        console.log(chunks);
        var dt = new Date(chunks[0]).getTime(); // using epoc as it takes less space than other representations
        if (_.isNaN(dt))
            return "continue"; // skip header and empty lines
        if (chunks[1]) {
            _.each(chunks[1].split(/ +/), function (c) {
                data[c] = data[c] || []; // initialize year array
                data[c].push(dt);
            });
        }
    };
    for (var _i = 0, _a = _.each(res.body.split(/\r*\n/)); _i < _a.length; _i++) {
        var line = _a[_i];
        _loop_1();
    }
    console.log(JSON.stringify(data, null, 4));
    app.listen(serverPort, function () {
        console.log("COMPASSTEST Service is listening on port " + serverPort);
        console.log("__dirname is " + __dirname);
    });
});
var app = express();
app.use('/compasstest', express.static(path.join(__dirname, '')));
var serverPort = 4000;
app.get('/compasstest/getdata', function (req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var byDate;
        return __generator(this, function (_a) {
            byDate = {};
            _.each(data, function (v, k) {
                byDate[k] = _.sortBy(v); // sort each numbers history by date
            });
            res.send(byDate);
            return [2 /*return*/];
        });
    });
});

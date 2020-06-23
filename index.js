"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
var typeorm_1 = require("typeorm");
var typeorm_2 = require("typeorm");
var details_1 = require("./tables/details");
var overview_1 = require("./tables/overview");
require("reflect-metadata");
var express = require("express");
var bodyParser = require("body-parser");
var server = express();
var port = process.env.PORT || 3000;
server.use(bodyParser.json());
//!Create TypeORM-Connection and Table
typeorm_1.createConnection().then(function (conn) {
    console.log("Datenbank-Connection steht");
});
// !API-Schnittstelle Locations
server.get("/", function (req, res) {
    console.log("Server ist online !");
    res.send("Server ist online !");
});
server.get("/locationPreview", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var locationPreview;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, typeorm_2.getConnection()
                    .getRepository(overview_1.LocationPreview)
                    .createQueryBuilder("preview") //*Alias für Einträge in LocationPreview
                    .getMany()];
            case 1:
                locationPreview = _a.sent();
                res.send(locationPreview);
                return [2 /*return*/];
        }
    });
}); });
server.get("/locationDetails", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var locationDetails;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, typeorm_2.getConnection()
                    .getRepository(overview_1.LocationPreview)
                    .createQueryBuilder("preview") //*Alias für Einträge in LocationPreview
                    .innerJoinAndSelect("preview.details", "details") //*Alias für Einträge in LocationPreview & LocationDetails
                    .getMany()];
            case 1:
                locationDetails = _a.sent();
                res.send(locationDetails);
                return [2 /*return*/];
        }
    });
}); });
server.post("/post", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var expectedBodyDetails, expectedBodyPreview, failResponse, item, item, locationPostDetails, locationPost, responseBody;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                expectedBodyDetails = {
                    id: req.body.id,
                    description: req.body.description,
                    squaremeter: req.body.squaremeter,
                    persons: req.body.persons,
                    minimumConsumption: req.body.minimumConsumption,
                    waterpipeline: req.body.waterpipeline,
                    power: req.body.power,
                    sanitary: req.body.sanitary,
                    mobile: req.body.mobile,
                    category: req.body.category,
                    calendar: req.body.calendar,
                };
                expectedBodyPreview = {
                    id: req.body.id,
                    title: req.body.title,
                    bild: req.body.bild,
                    place: req.body.place,
                    price: req.body.price,
                    date: new Date()
                };
                failResponse = [];
                for (item in expectedBodyDetails) {
                    if (expectedBodyDetails[item] === undefined || expectedBodyDetails[item] === null) {
                        failResponse.push(Object.keys(item));
                    }
                }
                for (item in expectedBodyPreview) {
                    if (expectedBodyPreview[item] === undefined || expectedBodyPreview[item] === null) {
                        failResponse.push(Object.keys(item));
                    }
                }
                //*Fail-Log abschicken
                if (failResponse.length !== 0) {
                    res.send("Folgende Parameter fehlen: " + failResponse);
                    return [2 /*return*/];
                }
                return [4 /*yield*/, typeorm_2.getConnection()
                        .createQueryBuilder()
                        .insert()
                        .into(details_1.LocationDetails)
                        .values([
                        expectedBodyDetails
                    ])
                        .execute()
                        .catch(function (err) {
                        res.send("Uuupps, hier ist ein Fehler aufgetreten");
                    })
                    //*Erstelle Preview
                ];
            case 1:
                locationPostDetails = _a.sent();
                return [4 /*yield*/, typeorm_2.getConnection()
                        .createQueryBuilder()
                        .insert()
                        .into(overview_1.LocationPreview)
                        .values([
                        expectedBodyPreview
                    ])
                        .execute()
                        .catch(function (err) {
                        console.log(err);
                        res.send("Eintrag schon vorhanden");
                    })
                    //*Berichterstattung
                ];
            case 2:
                locationPost = _a.sent();
                responseBody = {
                    preview: locationPost,
                    details: locationPostDetails,
                    status: "Posted on " + new Date()
                };
                // res.send(responseBody)
                res.send(responseBody);
                return [2 /*return*/];
        }
    });
}); });
server.delete("/delete", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (req.body.id === undefined || req.body.id === null) {
                    res.send("Bitte eine gültige ID angeben");
                    return [2 /*return*/];
                }
                return [4 /*yield*/, typeorm_2.getConnection()
                        .createQueryBuilder()
                        .delete()
                        .from(overview_1.LocationPreview)
                        .where("id = :id", { id: req.body.id })
                        .execute()];
            case 1:
                _a.sent();
                return [4 /*yield*/, typeorm_2.getConnection()
                        .createQueryBuilder()
                        .delete()
                        .from(details_1.LocationDetails)
                        .where("id = :id", { id: req.body.id })
                        .execute()];
            case 2:
                _a.sent();
                res.send("Location mit ID " + req.body.id + " wurde erfolgreich gel\u00F6scht");
                return [2 /*return*/];
        }
    });
}); });
server.put("/put", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var expectedBodyDetails, expectedBodyPreview, queryUpdaterDetails, queryUpdaterPreview, item;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (req.body.id === undefined || req.body.id === null) {
                    res.send("Bitte eine gültige ID angeben");
                    return [2 /*return*/];
                }
                expectedBodyDetails = {
                    // id: null,
                    description: null,
                    squaremeter: null,
                    persons: null,
                    minimumConsumption: null,
                    waterpipeline: null,
                    power: null,
                    sanitary: null,
                    mobile: null,
                    category: null,
                    calendar: null
                };
                expectedBodyPreview = {
                    // id: null,
                    title: null,
                    bild: null,
                    place: null,
                    price: null,
                };
                queryUpdaterDetails = {};
                queryUpdaterPreview = {};
                for (item in req.body) {
                    if (expectedBodyDetails[item] !== undefined) {
                        queryUpdaterDetails[item] = req.body[item];
                    }
                    else if (expectedBodyPreview[item] !== undefined) {
                        queryUpdaterPreview[item] = req.body[item];
                    }
                }
                if (!(Object.keys(queryUpdaterPreview).length !== 0)) return [3 /*break*/, 2];
                return [4 /*yield*/, typeorm_2.getConnection()
                        .createQueryBuilder()
                        .update(overview_1.LocationPreview)
                        .set(queryUpdaterPreview)
                        .where("id=:id", { id: req.body.id })
                        .execute()
                        .catch(function (err) {
                        res.send("Beim Updaten ist was schief gelaufen");
                    })];
            case 1:
                _a.sent();
                _a.label = 2;
            case 2:
                if (!(Object.keys(queryUpdaterDetails).length !== 0)) return [3 /*break*/, 4];
                return [4 /*yield*/, typeorm_2.getConnection()
                        .createQueryBuilder()
                        .update(details_1.LocationDetails)
                        .set(queryUpdaterDetails)
                        .where("id = :id", { id: req.body.id })
                        .execute()
                        .catch(function (err) {
                        res.send("Beim Updaten ist was schief gelaufen");
                    })];
            case 3:
                _a.sent();
                _a.label = 4;
            case 4:
                //! { bodyDetails: queryUpdaterDetails, bodyPreview: queryUpdaterPreview }
                res.send("Location mit ID " + req.body.id + " wurde erfolgreich angepasst !");
                return [2 /*return*/];
        }
    });
}); });
// !API-Schnittstelle Locations ENDE
server.listen(port, function () {
    console.log("event-server läuft");
});
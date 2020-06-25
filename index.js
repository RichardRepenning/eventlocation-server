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
var userdata_1 = require("./tables/userdata");
require("reflect-metadata");
var randomGenerator_1 = require("./randomGenerator");
var express = require("express");
var bodyParser = require("body-parser");
var cors = require("cors");
var server = express();
var port = process.env.PORT || 3000;
//!USE CORS for internal testing purposes
server.use(cors());
server.use(bodyParser.json());
var jwt = require('jsonwebtoken'); //?Implements JWT Service
var tokensSecret = "HeyItsMeMario987654321*/&!§$%%&&()=?";
//!Create TypeORM-Connection and Table(if not exists)
typeorm_1.createConnection().then(function (conn) {
    console.log("Datenbank-Connection steht");
    console.log("randomId-Generator Test", randomGenerator_1.default());
});
//!JWT Validation
var jwtTokenUberprufung = function (req, res, next) {
    var authent = req.headers.authorization;
    if (authent) {
        var jwtTokenAusHeader = authent.split(' ')[1];
        jwt.verify(jwtTokenAusHeader, tokensSecret, function (err, user) {
            if (err) {
                return res.send("Fehler, kein gültiger User oder du bist nicht eingeloggt");
            }
            console.log("user", user);
            req.user = user;
            next();
        });
    }
    else {
        res.send("Fehler, kein gültiger User oder du bist nicht eingeloggt");
    }
};
// !API-Schnittstelle Locations //
//?Just tests if Server is online
server.get("/", function (req, res) {
    console.log("Server ist online !");
    res.send("Server ist online !");
});
//?Register new User
server.post("/createUser", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var checkExistingUser, userdata;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, typeorm_2.getConnection()
                    .getRepository(userdata_1.UserData)
                    .createQueryBuilder("user")
                    .where("user.email = :email", { email: req.body.email })
                    .getOne()];
            case 1:
                checkExistingUser = _a.sent();
                if (checkExistingUser) {
                    res.send("Fehler, email-Adresse schon vorhanden, bitte wähle eine andere oder setze dein Passwort zurück");
                }
                userdata = {
                    id: "user_id_" + randomGenerator_1.default(),
                    username: req.body.username,
                    passwort: req.body.passwort,
                    email: req.body.email,
                    status: req.body.status,
                    registerDate: new Date()
                };
                return [4 /*yield*/, typeorm_2.getConnection()
                        .createQueryBuilder()
                        .insert()
                        .into(userdata_1.UserData)
                        .values([
                        userdata
                    ])
                        .execute()
                        .catch(function (err) {
                        res.send(err);
                    })];
            case 2:
                _a.sent();
                res.send("User " + userdata.username + " mit der Email " + userdata.email + " wurde am " + userdata.registerDate + " hinzugef\u00FCgt");
                return [2 /*return*/];
        }
    });
}); });
//?User-Login
server.post("/auth0/login", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user, sessionToken;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, typeorm_2.getConnection()
                    .getRepository(userdata_1.UserData)
                    .createQueryBuilder("user")
                    .where("user.email = :email", { email: req.body.email })
                    .getOne()];
            case 1:
                user = _a.sent();
                if (user) {
                    if (req.body.passwort === user.passwort) {
                        sessionToken = jwt.sign({ email: user.email, userId: user.id, status: user.status, username: user.username }, tokensSecret);
                        res.json({ sessionToken: sessionToken });
                    }
                    else {
                        res.send("Benutzername oder Passwort falsch");
                    }
                }
                else {
                    res.send("Benutzername oder Passwort falsch");
                }
                return [2 /*return*/];
        }
    });
}); });
//? Get Preview
server.get("/locationPreview/:limit", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var anzahl, locationPreview;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                anzahl = 20;
                if (req.params.limit !== undefined || req.params.limit !== null) {
                    anzahl = Number(req.params.limit);
                }
                return [4 /*yield*/, typeorm_2.getConnection()
                        .getRepository(overview_1.LocationPreview)
                        .createQueryBuilder("preview") //*Alias für Einträge in LocationPreview
                        .limit(anzahl)
                        .getMany()];
            case 1:
                locationPreview = _a.sent();
                res.send(locationPreview);
                return [2 /*return*/];
        }
    });
}); });
//?Get FullView
server.get("/locationDetails/:limit", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var anzahl, locationDetails;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                anzahl = 20;
                if (req.params.limit !== undefined || req.params.limit !== null) {
                    anzahl = Number(req.params.limit);
                }
                return [4 /*yield*/, typeorm_2.getConnection()
                        .getRepository(overview_1.LocationPreview)
                        .createQueryBuilder("preview") //*Alias für Einträge in LocationPreview
                        .innerJoinAndSelect("preview.locationDetails", "details") //*Alias für Einträge in LocationPreview & LocationDetails
                        .limit(anzahl)
                        .getMany()];
            case 1:
                locationDetails = _a.sent();
                res.send(locationDetails);
                return [2 /*return*/];
        }
    });
}); });
//?Get Location via ID
server.get("/locationDetails/id/:id", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var locationId, locationDetails;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (req.params.id !== undefined || req.params.id !== null) {
                    locationId = req.params.id;
                }
                return [4 /*yield*/, typeorm_2.getConnection()
                        .getRepository(overview_1.LocationPreview)
                        .createQueryBuilder("preview") //*Alias für Einträge in LocationPreview
                        .innerJoinAndSelect("preview.locationDetails", "details") //*Alias für Einträge in LocationPreview & LocationDetails
                        .where("preview.id = :id", { id: locationId })
                        .getOne()];
            case 1:
                locationDetails = _a.sent();
                res.send(locationDetails);
                return [2 /*return*/];
        }
    });
}); });
//?Post Location
server.post("/postLocation", jwtTokenUberprufung, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var uniqueId, expectedBodyDetails, expectedBodyPreview, failResponse, item, item, locationPostDetails, locationPost, responseBody;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                uniqueId = randomGenerator_1.default();
                if (req.user.userId === undefined || req.user.userId === null) {
                    res.send("Es liegt ein Fehler vor, bitte erneut einloggen");
                }
                expectedBodyDetails = {
                    id: uniqueId,
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
                    id: uniqueId,
                    title: req.body.title,
                    bild: req.body.bild,
                    place: req.body.place,
                    price: req.body.price,
                    date: new Date(),
                    username: req.body.username,
                    userId: req.user.userId
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
                        res.send(err);
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
                        res.send(err);
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
                res.send(responseBody);
                return [2 /*return*/];
        }
    });
}); });
//?Delete Location
server.delete("/deleteLocation/:id", jwtTokenUberprufung, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var locationDeleteCheck;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, typeorm_2.getConnection()
                    .getRepository(overview_1.LocationPreview)
                    .createQueryBuilder("preview")
                    .where("preview.userId = :userId", { userId: req.user.userId })
                    .andWhere("preview.id = :id", { id: req.params.id })
                    .getOne()];
            case 1:
                locationDeleteCheck = _a.sent();
                if (!locationDeleteCheck) {
                    res.send("Fehler, Anzeige konnte nicht gelöscht werden. Bitte überprüfe deinen Login");
                }
                return [4 /*yield*/, typeorm_2.getConnection()
                        .createQueryBuilder()
                        .delete()
                        .from(overview_1.LocationPreview)
                        .where("id = :id", { id: req.params.id })
                        .execute()
                        .catch(function (err) {
                        res.send(err);
                    })];
            case 2:
                _a.sent();
                return [4 /*yield*/, typeorm_2.getConnection()
                        .createQueryBuilder()
                        .delete()
                        .from(details_1.LocationDetails)
                        .where("id = :id", { id: req.params.id })
                        .execute()
                        .catch(function (err) {
                        res.send(err);
                    })];
            case 3:
                _a.sent();
                res.send("Location mit ID " + req.params.id + " wurde erfolgreich gel\u00F6scht");
                return [2 /*return*/];
        }
    });
}); });
//?Update Location
server.put("/updateLocation", jwtTokenUberprufung, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var LocationAvailable, expectedBodyDetails, expectedBodyPreview, queryUpdaterDetails, queryUpdaterPreview, item;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (req.body.id === undefined || req.body.id === null) {
                    res.send("Bitte eine gültige ID angeben");
                    return [2 /*return*/];
                }
                return [4 /*yield*/, typeorm_2.getConnection()
                        .getRepository(overview_1.LocationPreview)
                        .createQueryBuilder("preview")
                        .where("preview.userId = :userId", { userId: req.user.userId })
                        .andWhere("preview.id = :id", { id: req.body.id })
                        .getOne()];
            case 1:
                LocationAvailable = _a.sent();
                if (!LocationAvailable) {
                    res.send("Fehler, anzeige nicht vorhanden");
                    return [2 /*return*/];
                }
                expectedBodyDetails = {
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
                if (!(Object.keys(queryUpdaterPreview).length !== 0)) return [3 /*break*/, 3];
                return [4 /*yield*/, typeorm_2.getConnection()
                        .createQueryBuilder()
                        .update(overview_1.LocationPreview)
                        .set(queryUpdaterPreview)
                        .where("id=:id", { id: req.body.id })
                        .execute()
                        .catch(function (err) {
                        res.send("Beim Updaten ist was schief gelaufen");
                    })];
            case 2:
                _a.sent();
                _a.label = 3;
            case 3:
                if (!(Object.keys(queryUpdaterDetails).length !== 0)) return [3 /*break*/, 5];
                return [4 /*yield*/, typeorm_2.getConnection()
                        .createQueryBuilder()
                        .update(details_1.LocationDetails)
                        .set(queryUpdaterDetails)
                        .where("id = :id", { id: req.body.id })
                        .execute()
                        .catch(function (err) {
                        res.send("Beim Updaten ist was schief gelaufen");
                    })];
            case 4:
                _a.sent();
                _a.label = 5;
            case 5:
                //! { bodyDetails: queryUpdaterDetails, bodyPreview: queryUpdaterPreview }
                res.send("Location mit ID " + req.body.id + " wurde erfolgreich angepasst !");
                return [2 /*return*/];
        }
    });
}); });
//?Combined Search-Algorythm
server.post("/searchLocationAdvanced", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var searchParameter, searchQuery, parameter, searchResponse;
    var _a, _b, _c, _d;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                searchParameter = {
                    username: "preview",
                    userId: "preview",
                    title: "preview",
                    id: "preview",
                    price: "preview",
                    date: "preview",
                    sanitary: "details",
                    power: "details",
                    mobile: "details",
                    waterpipeline: "details",
                    description: "details",
                    squaremeter: "details",
                    persons: "details",
                    minimumConsumption: "details",
                    category: "details",
                    calendar: "details"
                };
                searchQuery = typeorm_1.getRepository(overview_1.LocationPreview)
                    .createQueryBuilder("preview")
                    .innerJoinAndSelect("preview.locationDetails", "details") //*Alias für Einträge in LocationPreview & LocationDetails
                    .where("preview.place like :place", { place: "%" + req.body.place + "%" });
                //*Filter and transform parameter & booleans (MariaDB doesn´t support real booleans)
                for (parameter in searchParameter) {
                    if (req.body[parameter] === "false" || req.body[parameter] === false) {
                        req.body[parameter] = 0;
                        searchQuery.andWhere(searchParameter[parameter] + "." + parameter + " = :" + parameter, (_a = {}, _a[parameter] = req.body[parameter], _a));
                    }
                    else if (req.body[parameter] === "true" || req.body[parameter] === true) {
                        req.body[parameter] = 1;
                        searchQuery.andWhere(searchParameter[parameter] + "." + parameter + " = :" + parameter, (_b = {}, _b[parameter] = req.body[parameter], _b));
                    }
                    else if (req.body[parameter] > 0) {
                        searchQuery.andWhere(searchParameter[parameter] + "." + parameter + " <= :" + parameter, (_c = {}, _c[parameter] = req.body[parameter], _c));
                    }
                    else if (req.body[parameter] !== "" && req.body[parameter] !== null && req.body[parameter] !== undefined) {
                        searchQuery.andWhere(searchParameter[parameter] + "." + parameter + " like :" + parameter, (_d = {}, _d[parameter] = "%" + req.body[parameter] + "%", _d));
                    }
                }
                return [4 /*yield*/, searchQuery.getMany().catch(function (err) {
                        res.send(err);
                    })];
            case 1:
                searchResponse = _e.sent();
                res.send(searchResponse);
                return [2 /*return*/];
        }
    });
}); });
//TODO
// server.get("/user", async (req: Request, res: Response) => {
//     const userdata = await getConnection()
//         .getRepository(UserData)
//         .createQueryBuilder("userdata")
//         .getMany()
//         .catch((err) => {
//             res.send(err)
//         })
//     res.send(userdata)
// })
// server.get("/userLocations", async (req: Request, res: Response) => {
//     const userdata = await getConnection()
//         .getRepository(UserData)
//         .createQueryBuilder("userdata") //*Alias für Einträge in LocationPreview
//         .innerJoinAndSelect("userdata.ownLocations", "preview") //*Alias für Einträge in LocationPreview & LocationDetails
//         .getMany()
//         .catch((err) => {
//             res.send(err)
//         })
//     res.send(userdata)
// })
//? TODO ENDE
// !API-Schnittstelle Locations ENDE //
server.listen(port, function () {
    console.log("event-server läuft");
});

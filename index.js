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
var messageCenter_1 = require("./tables/messageCenter");
require("reflect-metadata");
var randomGenerator_1 = require("./randomGenerator");
var express = require("express");
var bodyParser = require("body-parser");
var cors = require("cors");
var server = express();
var port = process.env.PORT || 3000;
//!WebSocket-Server
var Websocket = require("ws");
var url = "ws://localhost:3333";
//?WebsocketMessageBody for user & bot
function wsUserMessageBody(doFunction, register, username, topic, message) {
    if (topic === void 0) { topic = ""; }
    if (message === void 0) { message = ""; }
    return {
        doFunction: doFunction,
        register: register,
        username: username,
        topic: topic,
        message: message
    };
}
function wsBotMessageBody(doFunction, register, bot_id, topic, message) {
    if (topic === void 0) { topic = "auto"; }
    if (message === void 0) { message = "auto"; }
    return {
        doFunction: doFunction,
        register: register,
        bot_id: bot_id,
        topic: topic,
        message: message
    };
}
//?Function can be implemented into POSTS
function pushNewAds(place, username, price) {
    if (place === void 0) { place = ""; }
    if (username === void 0) { username = ""; }
    if (price === void 0) { price = ""; }
    connectionPushBot.send(JSON.stringify({
        register: false,
        bot_id: "connectionPushBot",
        topic: "newAds posted !",
        message: "New Ad was posted",
        doFunction: "PUSH Ads",
        place: place,
        username: username,
        price: price
    }));
}
//?TestBot raects to webocket-API endpoint
var connectionMainBot = new Websocket(url);
connectionMainBot.onopen = function () {
    console.log("Verbindung steht");
    var register = {
        register: true,
        name: "Message-Bot",
        bot_id: "connectionMainBot",
        doFunction: "NEW bot",
        date: new Date()
    };
    connectionMainBot.send(JSON.stringify(register));
};
connectionMainBot.onmessage = function (mess) {
    console.log(mess.data);
};
//?PushBot sends new Ads to User
var connectionPushBot = new Websocket(url);
connectionPushBot.onopen = function () {
    console.log("Verbindung steht");
    var register = {
        register: true,
        name: "PushAds-Bot",
        doFunction: "NEW bot",
        bot_id: "connectionPushBot",
        date: new Date()
    };
    connectionPushBot.send(JSON.stringify(register));
};
//!WebSocket-Server END
//!USE CORS for internal testing purposes
server.use(cors());
server.use(bodyParser.json());
//!USE jwt and bcrypt for user authentication
var jwt = require('jsonwebtoken'); //?Implements JWT Service
var tokensSecret = "HeyItsMeMario987654321*/&!§$%%&&()=?";
var bcrypt = require("bcrypt"); //*For password encryption
var saltRounds = 10; //*level of Password salting
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
                return res.json("Fehler, kein gültiger User oder du bist nicht eingeloggt");
            }
            console.log("user", user);
            req["user"] = user;
            next();
        });
    }
    else {
        res.json("Fehler, kein gültiger User oder du bist nicht eingeloggt");
    }
};
//*TEST Websocket-API || Catch all bots
server.get("/websocket", function (req, res) {
    connectionMainBot.send(JSON.stringify({
        register: false,
        name: "Message-Bot",
        bot_id: "connectionMainBot",
        message: "Ich bin die Api Websocket",
        doFunction: "GET bots"
    }));
    res.json("Message-Bot registered");
});
server.delete("/websocketBots", jwtTokenUberprufung, function (req, res) {
    if (req["user"]["role"] === "admin") {
        connectionMainBot.close();
        connectionPushBot.close();
        res.json("All bots deleted");
    }
    else {
        res.json("Keine Rechte");
    }
});
server.post("/websocketBots", jwtTokenUberprufung, function (req, res) {
    if (req["user"]["role"] === "admin") {
        connectionMainBot.open();
        connectionPushBot.open();
        res.json("Bots reaktiviert");
    }
    else {
        res.json("Keine Rechte");
    }
});
// !API-Schnittstelle User //
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
                    res.json("Fehler, email-Adresse schon vorhanden, bitte wähle eine andere oder setze dein Passwort zurück");
                }
                userdata = {
                    id: "user_id_" + randomGenerator_1.default(),
                    vorname: req.body.vorname,
                    nachname: req.body.nachname,
                    telephone: req.body.telephone,
                    email: req.body.email,
                    passwort: null,
                    username: req.body.username,
                    strasse: req.body.strasse,
                    ort: req.body.ort,
                    plz: req.body.plz,
                    status: req.body.status,
                    registerDate: new Date()
                };
                //*Starts password encryption
                return [4 /*yield*/, bcrypt
                        .hash(req.body.passwort, saltRounds)
                        .then(function (hash) {
                        console.log("Hash: " + hash);
                        userdata.passwort = hash;
                    })
                        .catch(function (err) { return console.error(err.message); })];
            case 2:
                //*Starts password encryption
                _a.sent();
                return [4 /*yield*/, typeorm_2.getConnection()
                        .createQueryBuilder()
                        .insert()
                        .into(userdata_1.UserData)
                        .values([
                        userdata
                    ])
                        .execute()
                        .catch(function (err) {
                        res.json(err);
                    })];
            case 3:
                _a.sent();
                res.json("User " + userdata.username + " mit der Email " + userdata.email + " wurde am " + userdata.registerDate + " hinzugef\u00FCgt");
                return [2 /*return*/];
        }
    });
}); });
//?User-Login
server.post("/auth0/login", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (req.body.email === undefined || req.body.email === "") {
                    res.json("Bitte eine gültige Email angeben");
                }
                return [4 /*yield*/, typeorm_2.getConnection()
                        .getRepository(userdata_1.UserData)
                        .createQueryBuilder("user")
                        .where("user.email = :email", { email: req.body.email })
                        .getOne()];
            case 1:
                user = _a.sent();
                if (user) {
                    bcrypt
                        .compare(req.body.passwort, user.passwort)
                        .then(function (ress) {
                        console.log("user", user);
                        console.log("ress", ress);
                        if (ress) {
                            var sessionToken = jwt.sign({ email: user.email, userId: user.id, status: user.status, username: user.username, role: user.role, websocketAccess: user.websocketAccess }, tokensSecret);
                            res.json({ sessionToken: sessionToken });
                        }
                        else {
                            res.json("Benutzername oder Passwort falsch | User nicht vorhanden");
                        }
                    })
                        .catch(function (err) {
                        res.json(err.message);
                        console.error(err.message);
                    });
                }
                else {
                    res.json("Benutzername oder Passwort falsch | User nicht vorhanden");
                }
                return [2 /*return*/];
        }
    });
}); });
// !API-Schnittstelle User END//
// !API-Schnittstelle Messages //
//?Send new message to recipient
server.post("/message/:username", jwtTokenUberprufung, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var recipient, messagebody, updateMessagesCenter, feedback;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, typeorm_2.getConnection()
                    .getRepository(userdata_1.UserData)
                    .createQueryBuilder("user")
                    .select("user.id")
                    .where("user.username = :username", { username: req.params.username })
                    .getOne()
                    .catch(function (err) {
                    res.json(err);
                })];
            case 1:
                recipient = _a.sent();
                messagebody = {
                    id: "message_id_" + randomGenerator_1.default(),
                    messageId: "message_id_" + randomGenerator_1.default(),
                    date: new Date,
                    topic: req.body.topic,
                    message: req.body.message,
                    createdByName: req["user"]["username"],
                    createdById: req["user"]["userId"],
                    receivedByName: req.params.username,
                    receivedById: recipient["id"]
                };
                return [4 /*yield*/, typeorm_2.getConnection()
                        .createQueryBuilder()
                        .insert()
                        .into(messageCenter_1.MessageCenter)
                        .values([
                        messagebody
                    ])
                        .execute()
                        .catch(function (err) {
                        res.json(err);
                    })];
            case 2:
                updateMessagesCenter = _a.sent();
                feedback = {
                    status: "sent",
                    topic: req.body.topic,
                    message: req.body.message,
                };
                res.json(feedback);
                return [2 /*return*/];
        }
    });
}); });
//?get all messages related to user
server.get("/getMessages", jwtTokenUberprufung, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var sentMessages, receivedMessages, feedback;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, typeorm_2.getConnection()
                    .getRepository(messageCenter_1.MessageCenter)
                    .createQueryBuilder("message")
                    .select("message.messageId")
                    .addSelect("message.date")
                    .addSelect("message.topic")
                    .addSelect("message.message")
                    .addSelect("message.createdByName")
                    .addSelect("message.receivedByName")
                    .where("message.createdById = :createdById", { createdById: req["user"]["userId"] })
                    .getMany()];
            case 1:
                sentMessages = _a.sent();
                return [4 /*yield*/, typeorm_2.getConnection()
                        .getRepository(messageCenter_1.MessageCenter)
                        .createQueryBuilder("message")
                        .select("message.messageId")
                        .addSelect("message.date")
                        .addSelect("message.topic")
                        .addSelect("message.message")
                        .addSelect("message.createdByName")
                        .addSelect("message.receivedByName")
                        .where("message.receivedById = :receivedById", { receivedById: req["user"]["userId"] })
                        .getMany()];
            case 2:
                receivedMessages = _a.sent();
                feedback = {
                    sentMessages: sentMessages,
                    receivedMessages: receivedMessages
                };
                res.json(feedback);
                return [2 /*return*/];
        }
    });
}); });
//?delete raleted message
server.delete("/deleteUserMessage/:messageId", jwtTokenUberprufung, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var findRelatedMessage, generatedMessage, informRecipient, deleteMessage, messageBotmessage, deleteMessage;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, typeorm_2.getConnection()
                    .getRepository(messageCenter_1.MessageCenter)
                    .createQueryBuilder("message")
                    .where("message.createdById = :createdById", { createdById: req["user"]["userId"] })
                    .andWhere("message.messageId = :messageId", { messageId: req.params.messageId })
                    .getOne()];
            case 1:
                findRelatedMessage = _a.sent();
                if (!findRelatedMessage) return [3 /*break*/, 5];
                if (!(findRelatedMessage["createdByName"] !== "Message-Bot")) return [3 /*break*/, 3];
                generatedMessage = {
                    id: "message_id_" + randomGenerator_1.default(),
                    messageId: "message_id_" + randomGenerator_1.default(),
                    date: new Date,
                    topic: "Message deleted !!",
                    message: "Der User hat die Nachricht mit ID " + findRelatedMessage["messageId"] + " gel\u00F6scht",
                    createdByName: "Message-Bot",
                    createdById: "Message-Bot",
                    receivedByName: findRelatedMessage["receivedByName"],
                    receivedById: findRelatedMessage["receivedById"]
                };
                return [4 /*yield*/, typeorm_2.getConnection()
                        .createQueryBuilder()
                        .insert()
                        .into(messageCenter_1.MessageCenter)
                        .values([
                        generatedMessage
                    ])
                        .execute()
                        .catch(function (err) {
                        res.json(err);
                    })];
            case 2:
                informRecipient = _a.sent();
                _a.label = 3;
            case 3: return [4 /*yield*/, typeorm_2.getConnection()
                    .createQueryBuilder()
                    .delete()
                    .from(messageCenter_1.MessageCenter)
                    .where("messageId = :messageId", { messageId: req.params.messageId })
                    .execute()
                    .catch(function (err) {
                    res.json(err);
                })];
            case 4:
                deleteMessage = _a.sent();
                res.json("Nachricht mit ID " + req.params.messageId + " erfolgreich gel\u00F6scht");
                return [3 /*break*/, 9];
            case 5: return [4 /*yield*/, typeorm_2.getConnection()
                    .getRepository(messageCenter_1.MessageCenter)
                    .createQueryBuilder("message")
                    .where("message.createdById = :createdById", { createdById: "Message-Bot" })
                    .andWhere("message.messageId = :messageId", { messageId: req.params.messageId })
                    .andWhere("message.receivedById = :receivedById", { receivedById: req["user"]["userId"] })
                    .getOne()];
            case 6:
                messageBotmessage = _a.sent();
                if (!messageBotmessage) return [3 /*break*/, 8];
                return [4 /*yield*/, typeorm_2.getConnection()
                        .createQueryBuilder()
                        .delete()
                        .from(messageCenter_1.MessageCenter)
                        .where("messageId = :messageId", { messageId: req.params.messageId })
                        .execute()
                        .catch(function (err) {
                        res.json(err);
                    })];
            case 7:
                deleteMessage = _a.sent();
                res.json("Nachricht mit ID " + req.params.messageId + " erfolgreich gel\u00F6scht");
                return [3 /*break*/, 9];
            case 8:
                res.json("Es gibt keine Nachrichten zu dieser ID");
                _a.label = 9;
            case 9: return [2 /*return*/];
        }
    });
}); });
// !API-Schnittstelle Messages END//
// !API-Schnittstelle Locations //
//?Just tests if Server is online
server.get("/", function (req, res) {
    console.log("Server ist online !");
    res.json("Server ist online !");
});
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
                res.json(locationPreview);
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
                res.json(locationDetails);
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
                res.json(locationDetails);
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
                if (req["user"]["userId"] === undefined || req["user"]["userId"] === null) {
                    res.json("Es liegt ein Fehler vor, bitte erneut einloggen");
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
                    username: req["user"]["username"],
                    userId: req["user"]["userId"]
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
                    res.json("Folgende Parameter fehlen: " + failResponse);
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
                        res.json(err);
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
                        res.json(err);
                    })
                    //*Berichterstattung
                ];
            case 2:
                locationPost = _a.sent();
                responseBody = {
                    preview: expectedBodyPreview,
                    details: expectedBodyDetails,
                    status: "Posted on " + new Date()
                };
                res.json(responseBody);
                pushNewAds(expectedBodyPreview.place, req["user"]["username"], expectedBodyPreview.price);
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
                    .where("preview.userId = :userId", { userId: req["user"]["userId"] })
                    .andWhere("preview.id = :id", { id: req.params.id })
                    .getOne()];
            case 1:
                locationDeleteCheck = _a.sent();
                if (!locationDeleteCheck) {
                    res.json("Fehler, Anzeige konnte nicht gelöscht werden. Bitte überprüfe deinen Login");
                }
                return [4 /*yield*/, typeorm_2.getConnection()
                        .createQueryBuilder()
                        .delete()
                        .from(overview_1.LocationPreview)
                        .where("id = :id", { id: req.params.id })
                        .execute()
                        .catch(function (err) {
                        res.json(err);
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
                        res.json(err);
                    })];
            case 3:
                _a.sent();
                res.json("Location mit ID " + req.params.id + " wurde erfolgreich gel\u00F6scht");
                return [2 /*return*/];
        }
    });
}); });
//?Update Location
server.put("/updateLocation/:id", jwtTokenUberprufung, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var LocationAvailable, expectedBodyDetails, expectedBodyPreview, queryUpdaterDetails, queryUpdaterPreview, item;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, typeorm_2.getConnection()
                    .getRepository(overview_1.LocationPreview)
                    .createQueryBuilder("preview")
                    .where("preview.userId = :userId", { userId: req["user"]["userId"] })
                    .andWhere("preview.id = :id", { id: req.params.id })
                    .getOne()];
            case 1:
                LocationAvailable = _a.sent();
                if (!LocationAvailable) {
                    res.json("Fehler, anzeige nicht vorhanden");
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
                        .where("id=:id", { id: req.params.id })
                        .execute()
                        .catch(function (err) {
                        res.json("Beim Updaten ist was schief gelaufen");
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
                        .where("id = :id", { id: req.params.id })
                        .execute()
                        .catch(function (err) {
                        res.json("Beim Updaten ist was schief gelaufen");
                    })];
            case 4:
                _a.sent();
                _a.label = 5;
            case 5:
                //! { bodyDetails: queryUpdaterDetails, bodyPreview: queryUpdaterPreview }
                res.json("Location mit ID " + req.params.id + " wurde erfolgreich angepasst !");
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
                        res.json(err);
                    })];
            case 1:
                searchResponse = _e.sent();
                res.json(searchResponse);
                return [2 /*return*/];
        }
    });
}); });
//? Just fetch created Locations from User
server.get("/userCreatedLocations", jwtTokenUberprufung, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userLocations;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, typeorm_2.getConnection()
                    .getRepository(overview_1.LocationPreview)
                    .createQueryBuilder("preview") //*Alias für Einträge in LocationPreview
                    .innerJoinAndSelect("preview.locationDetails", "details") //*Alias für Einträge in LocationPreview & LocationDetails
                    .where("preview.userId = :userId", { userId: req["user"]["userId"] })
                    .getMany()
                    .catch(function (err) {
                    res.json("Fehler");
                })];
            case 1:
                userLocations = _a.sent();
                res.json(userLocations);
                return [2 /*return*/];
        }
    });
}); });
//? Save Favourite by location ID
server.put("/saveFavouriteLocations/:id", jwtTokenUberprufung, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var favourites, newArray, duplicateCheck, updateFavourites;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, typeorm_2.getConnection()
                    .getRepository(userdata_1.UserData)
                    .createQueryBuilder("user")
                    .select("user.favourites")
                    .where("user.id = :id", { id: req["user"]["userId"] })
                    .getOne()];
            case 1:
                favourites = _a.sent();
                newArray = [];
                if (favourites.favourites === "") {
                    newArray.push(req.params.id);
                }
                else {
                    newArray = JSON.parse(favourites.favourites);
                    duplicateCheck = newArray.some(function (entry) {
                        return entry === req.params.id;
                    });
                    if (!duplicateCheck) {
                        newArray.push(req.params.id);
                    }
                    else {
                        res.json("Location ist bereits als Favourit gespeichert");
                    }
                }
                return [4 /*yield*/, typeorm_2.getConnection()
                        .createQueryBuilder()
                        .update(userdata_1.UserData)
                        .set({ favourites: JSON.stringify(newArray) })
                        .where("id = :id", { id: req["user"]["userId"] })
                        .execute()];
            case 2:
                updateFavourites = _a.sent();
                res.json("Zu Favouriten hinzugef\u00FCgt: " + newArray);
                return [2 /*return*/];
        }
    });
}); });
//?Just return user favourites
server.get("/userFavourites", jwtTokenUberprufung, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var listOfFavourites, favourites, locationDetails;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, typeorm_2.getConnection()
                    .getRepository(userdata_1.UserData)
                    .createQueryBuilder("user")
                    .select("user.favourites")
                    .where("user.id = :id", { id: req["user"]["userId"] })
                    .getOne()
                    .catch(function (err) {
                    res.json(err);
                })];
            case 1:
                listOfFavourites = _a.sent();
                if (listOfFavourites["favourites"] !== "") {
                    favourites = JSON.parse(listOfFavourites["favourites"]);
                }
                else {
                    res.json("Keine Favouriten gespeichert");
                }
                return [4 /*yield*/, typeorm_2.getConnection()
                        .getRepository(overview_1.LocationPreview)
                        .createQueryBuilder("preview") //*Alias für Einträge in LocationPreview
                        .innerJoinAndSelect("preview.locationDetails", "details") //*Alias für Einträge in LocationPreview & LocationDetails
                        .where("preview.id IN (:...id)", { id: favourites })
                        .getMany()];
            case 2:
                locationDetails = _a.sent();
                res.json(locationDetails);
                return [2 /*return*/];
        }
    });
}); });
//? Deletes users favourite
server.delete("/deleteUserFavourite/:id", jwtTokenUberprufung, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var listOfUserFavourites, newListOfUserFavourites, updateFavourites;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, typeorm_2.getConnection()
                    .getRepository(userdata_1.UserData)
                    .createQueryBuilder("user")
                    .select("user.favourites")
                    .where("user.id = :id", { id: req["user"]["userId"] })
                    .getOne()];
            case 1:
                listOfUserFavourites = _a.sent();
                newListOfUserFavourites = JSON.parse(listOfUserFavourites["favourites"]).filter(function (entry) {
                    return entry !== req.params.id;
                });
                return [4 /*yield*/, typeorm_2.getConnection()
                        .createQueryBuilder()
                        .update(userdata_1.UserData)
                        .set({ favourites: JSON.stringify(newListOfUserFavourites) })
                        .where("id = :id", { id: req["user"]["userId"] })
                        .execute()];
            case 2:
                updateFavourites = _a.sent();
                res.json(newListOfUserFavourites);
                return [2 /*return*/];
        }
    });
}); });
// !API-Schnittstelle Locations ENDE //
server.listen(port, function () {
    console.log("event-server läuft");
});

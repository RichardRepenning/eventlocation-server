import { Request, Response } from "express";
import { createConnection, Connection, getRepository } from "typeorm";
import { getConnection, createQueryBuilder } from "typeorm";
import { LocationDetails } from './tables/details'
import { LocationPreview } from './tables/overview'
import { UserData } from './tables/userdata'
import { MessageCenter } from './tables/messageCenter'
import "reflect-metadata";
import randomId from './randomGenerator'

const express = require("express")
const bodyParser = require("body-parser")
const cors = require("cors")
const server = express()
const port = process.env.PORT || 3000

//!USE CORS for internal testing purposes
server.use(cors())
server.use(bodyParser.json())

//!USE jwt and bcrypt for user authentication
const jwt = require('jsonwebtoken'); //?Implements JWT Service
const tokensSecret = "HeyItsMeMario987654321*/&!§$%%&&()=?"
const bcrypt = require("bcrypt"); //*For password encryption
const saltRounds = 10; //*level of Password salting

//!Create TypeORM-Connection and Table(if not exists)
createConnection().then(conn => {
    console.log("Datenbank-Connection steht")
    console.log("randomId-Generator Test", randomId())
})

//!JWT Validation
const jwtTokenUberprufung = (req: Request, res: Response, next) => {

    const authent = req.headers.authorization

    if (authent) {
        const jwtTokenAusHeader = authent.split(' ')[1]
        jwt.verify(jwtTokenAusHeader, tokensSecret, (err, user) => {
            if (err) {
                return res.json("Fehler, kein gültiger User oder du bist nicht eingeloggt")
            }
            console.log("user", user)
            req["user"] = user;
            next();
        });
    } else {
        res.json("Fehler, kein gültiger User oder du bist nicht eingeloggt")
    }
}

// !API-Schnittstelle User //
//?Register new User
server.post("/createUser", async (req: Request, res: Response) => {

    const checkExistingUser = await getConnection()
        .getRepository(UserData)
        .createQueryBuilder("user")
        .where("user.email = :email", { email: req.body.email })
        .getOne()

    if (checkExistingUser) {
        res.json("Fehler, email-Adresse schon vorhanden, bitte wähle eine andere oder setze dein Passwort zurück")
    }

    const userdata = {
        id: `user_id_${randomId()}`, //User-ID default "Gast"
        username: req.body.username,
        passwort: null,
        email: req.body.email,
        status: req.body.status,
        registerDate: new Date()
    }

    //*Starts password encryption

    await bcrypt
        .hash(req.body.passwort, saltRounds)
        .then(hash => {
            console.log(`Hash: ${hash}`);
            userdata.passwort = hash
        })
        .catch(err => console.error(err.message));

    await getConnection()
        .createQueryBuilder()
        .insert()
        .into(UserData)
        .values([
            userdata
        ])
        .execute()
        .catch((err) => {
            res.json(err)
        })
    res.json(`User ${userdata.username} mit der Email ${userdata.email} wurde am ${userdata.registerDate} hinzugefügt`)
})
//?User-Login
server.post("/auth0/login", async (req: Request, res: Response) => {

    if (req.body.email === undefined || req.body.email === "") {
        res.json("Bitte eine gültige Email angeben")
    }

    const user = await getConnection()
        .getRepository(UserData)
        .createQueryBuilder("user")
        .where("user.email = :email", { email: req.body.email })
        .getOne()


    if (user) {
        bcrypt
            .compare(req.body.passwort, user.passwort)
            .then((ress) => {
                console.log("user", user)
                console.log("ress", ress)
                if (ress) {
                    const sessionToken = jwt.sign({ email: user.email, userId: user.id, status: user.status, username: user.username }, tokensSecret)
                    res.json({ sessionToken })
                } else {
                    res.json("Benutzername oder Passwort falsch | User nicht vorhanden")
                }
            })
            .catch((err) => {
                res.json(err.message)
                console.error(err.message)
            })
    } else {
        res.json("Benutzername oder Passwort falsch | User nicht vorhanden")
    }

})
// !API-Schnittstelle User END//


// !API-Schnittstelle Messages //
//?Send new message to recipient
server.post("/message/:username", jwtTokenUberprufung, async (req: Request, res: Response) => {

    const recipient = await getConnection()
        .getRepository(UserData)
        .createQueryBuilder("user")
        .select("user.id")
        .where("user.username = :username", { username: req.params.username })
        .getOne()
        .catch((err) => {
        res.json(err)
    })

    const messagebody = {
        id: `message_id_${randomId()}`,
        messageId: `message_id_${randomId()}`,
        date: new Date,
        topic: req.body.topic,
        message: req.body.message,
        createdByName: req["user"]["username"],
        createdById: req["user"]["userId"],
        receivedByName: req.params.username,
        receivedById: recipient["id"]
    }

    const updateMessagesCenter = await getConnection()
        .createQueryBuilder()
        .insert()
        .into(MessageCenter)
        .values([
            messagebody
        ])
        .execute()
        .catch((err) => {
            res.json(err)
        })

    const feedback = {
        status: "sent",
        topic: req.body.topic,
        message: req.body.message,
    }

    res.json(feedback)

})
//?get all messages related to user
server.get("/getMessages", jwtTokenUberprufung, async (req: Request, res: Response) => {
    
    const sentMessages = await getConnection()
        .getRepository(MessageCenter)
        .createQueryBuilder("message")
        .select("message.messageId")
        .addSelect("message.date")
        .addSelect("message.topic")
        .addSelect("message.message")
        .addSelect("message.createdByName")
        .addSelect("message.receivedByName")
        .where("message.createdById = :createdById", { createdById: req["user"]["userId"]})
        .getMany()
    
    const receivedMessages = await getConnection()
        .getRepository(MessageCenter)
        .createQueryBuilder("message")
        .select("message.messageId")
        .addSelect("message.date")
        .addSelect("message.topic")
        .addSelect("message.message")
        .addSelect("message.createdByName")
        .addSelect("message.receivedByName")
        .where("message.receivedById = :receivedById", { receivedById: req["user"]["userId"] })
        .getMany()
    
    const feedback = {
        sentMessages: sentMessages,
        receivedMessages: receivedMessages
    }

    res.json(feedback)
    
})
// !API-Schnittstelle Messages END//


// !API-Schnittstelle Locations //
//?Just tests if Server is online
server.get("/", (req: Request, res: Response) => {
    console.log("Server ist online !")
    res.json("Server ist online !")
})
//? Get Preview
server.get("/locationPreview/:limit", async (req: Request, res: Response) => {

    let anzahl = 20;
    if (req.params.limit !== undefined || req.params.limit !== null) {
        anzahl = Number(req.params.limit)
    }

    const locationPreview = await getConnection()
        .getRepository(LocationPreview)
        .createQueryBuilder("preview") //*Alias für Einträge in LocationPreview
        .limit(anzahl)
        .getMany();

    res.json(locationPreview)
})
//?Get FullView
server.get("/locationDetails/:limit", async (req: Request, res: Response) => {

    let anzahl = 20;
    if (req.params.limit !== undefined || req.params.limit !== null) {
        anzahl = Number(req.params.limit)
    }
    const locationDetails = await getConnection()
        .getRepository(LocationPreview)
        .createQueryBuilder("preview") //*Alias für Einträge in LocationPreview
        .innerJoinAndSelect("preview.locationDetails", "details") //*Alias für Einträge in LocationPreview & LocationDetails
        .limit(anzahl)
        .getMany();

    res.json(locationDetails)
})
//?Get Location via ID
server.get("/locationDetails/id/:id", async (req: Request, res: Response) => {

    let locationId: string;

    if (req.params.id !== undefined || req.params.id !== null) {
        locationId = req.params.id
    }

    const locationDetails = await getConnection()
        .getRepository(LocationPreview)
        .createQueryBuilder("preview") //*Alias für Einträge in LocationPreview
        .innerJoinAndSelect("preview.locationDetails", "details") //*Alias für Einträge in LocationPreview & LocationDetails
        .where("preview.id = :id", { id: locationId })
        .getOne();

    res.json(locationDetails)
})
//?Post Location
server.post("/postLocation", jwtTokenUberprufung, async (req: Request, res: Response) => {

    let uniqueId: string = randomId()

    if (req["user"]["userId"] === undefined || req["user"]["userId"] === null) {
        res.json("Es liegt ein Fehler vor, bitte erneut einloggen")
    }

    const expectedBodyDetails = {
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
    }

    const expectedBodyPreview = {
        id: uniqueId,
        title: req.body.title,
        bild: req.body.bild,
        place: req.body.place,
        price: req.body.price,
        date: new Date(),
        username: req.body.username,
        userId: req["user"]["userId"]
    }

    //*Fail-Log erstellen
    let failResponse = []

    for (let item in expectedBodyDetails) {
        if (expectedBodyDetails[item] === undefined || expectedBodyDetails[item] === null) {
            failResponse.push(Object.keys(item))
        }
    }

    for (let item in expectedBodyPreview) {
        if (expectedBodyPreview[item] === undefined || expectedBodyPreview[item] === null) {
            failResponse.push(Object.keys(item))
        }
    }
    //*Fail-Log abschicken
    if (failResponse.length !== 0) {
        res.json(`Folgende Parameter fehlen: ${failResponse}`)
        return
    }

    //*Erstelle Details
    const locationPostDetails = await getConnection()
        .createQueryBuilder()
        .insert()
        .into(LocationDetails)
        .values([
            expectedBodyDetails
        ])
        .execute()
        .catch((err) => {
            res.json(err)
        })

    //*Erstelle Preview
    const locationPost = await getConnection()
        .createQueryBuilder()
        .insert()
        .into(LocationPreview)
        .values([
            expectedBodyPreview
        ])
        .execute()
        .catch((err) => {
            console.log(err)
            res.json(err)
        })

    //*Berichterstattung
    const responseBody = {
        preview: expectedBodyPreview,
        details: expectedBodyDetails,
        status: `Posted on ${new Date()}`
    }

    res.json(responseBody)
})
//?Delete Location
server.delete("/deleteLocation/:id", jwtTokenUberprufung, async (req: Request, res: Response) => {

    const locationDeleteCheck = await getConnection()
        .getRepository(LocationPreview)
        .createQueryBuilder("preview")
        .where("preview.userId = :userId", { userId: req["user"]["userId"] })
        .andWhere("preview.id = :id", { id: req.params.id })
        .getOne()

    if (!locationDeleteCheck) {
        res.json("Fehler, Anzeige konnte nicht gelöscht werden. Bitte überprüfe deinen Login")
    }

    await getConnection()
        .createQueryBuilder()
        .delete()
        .from(LocationPreview)
        .where("id = :id", { id: req.params.id })
        .execute()
        .catch((err) => {
            res.json(err)
        })

    await getConnection()
        .createQueryBuilder()
        .delete()
        .from(LocationDetails)
        .where("id = :id", { id: req.params.id })
        .execute()
        .catch((err) => {
            res.json(err)
        })

    res.json(`Location mit ID ${req.params.id} wurde erfolgreich gelöscht`)

})
//?Update Location
server.put("/updateLocation/:id", jwtTokenUberprufung, async (req: Request, res: Response) => {

    //*Validate Location to userId and Id
    const LocationAvailable = await getConnection()
        .getRepository(LocationPreview)
        .createQueryBuilder("preview")
        .where("preview.userId = :userId", { userId: req["user"]["userId"] })
        .andWhere("preview.id = :id", { id: req.params.id })
        .getOne()

    if (!LocationAvailable) {
        res.json("Fehler, anzeige nicht vorhanden")
        return
    }

    //*Templates zum Updaten
    const expectedBodyDetails = {
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
    }
    const expectedBodyPreview = {
        title: null,
        bild: null,
        place: null,
        price: null,
    }
    //*Templates zum Updaten ENDE


    //*Erstelle Update-Objecte aus Template
    let queryUpdaterDetails = {}
    let queryUpdaterPreview = {}
    for (let item in req.body) {
        if (expectedBodyDetails[item] !== undefined) {
            queryUpdaterDetails[item] = req.body[item]
        }
        else if (expectedBodyPreview[item] !== undefined) {
            queryUpdaterPreview[item] = req.body[item]
        }
    }
    //*Updates Preview-Table
    if (Object.keys(queryUpdaterPreview).length !== 0) {

        await getConnection()
            .createQueryBuilder()
            .update(LocationPreview)
            .set(queryUpdaterPreview)
            .where("id=:id", { id: req.params.id })
            .execute()
            .catch((err) => {
                res.json("Beim Updaten ist was schief gelaufen")
            })
    }
    //*Updates Details-Table
    if (Object.keys(queryUpdaterDetails).length !== 0) {

        await getConnection()
            .createQueryBuilder()
            .update(LocationDetails)
            .set(queryUpdaterDetails)
            .where("id = :id", { id: req.params.id })
            .execute()
            .catch((err) => {
                res.json("Beim Updaten ist was schief gelaufen")
            })
    }

    //! { bodyDetails: queryUpdaterDetails, bodyPreview: queryUpdaterPreview }
    res.json(`Location mit ID ${req.params.id} wurde erfolgreich angepasst !`)
})
//?Combined Search-Algorythm
server.post("/searchLocationAdvanced", async (req: Request, res: Response) => {

    //*SearchParameter-Template
    const searchParameter = {
        username: "preview", //!Preview-Table
        userId: "preview",
        title: "preview",
        id: "preview",
        price: "preview",
        date: "preview",
        sanitary: "details", //!Details-Table joined in Preview-Table
        power: "details",
        mobile: "details",
        waterpipeline: "details",
        description: "details",
        squaremeter: "details",
        persons: "details",
        minimumConsumption: "details",
        category: "details",
        calendar: "details"
    }

    //*Open SearchQuery
    let searchQuery =
        getRepository(LocationPreview)
            .createQueryBuilder("preview")
            .innerJoinAndSelect("preview.locationDetails", "details") //*Alias für Einträge in LocationPreview & LocationDetails
            .where("preview.place like :place", { place: `%${req.body.place}%` })

    //*Filter and transform parameter & booleans (MariaDB doesn´t support real booleans)
    for (let parameter in searchParameter) {

        if (req.body[parameter] === "false" || req.body[parameter] === false) {

            req.body[parameter] = 0;

            searchQuery.andWhere(`${searchParameter[parameter]}.${parameter} = :${parameter}`, { [parameter]: req.body[parameter] })
        } else if (req.body[parameter] === "true" || req.body[parameter] === true) {

            req.body[parameter] = 1

            searchQuery.andWhere(`${searchParameter[parameter]}.${parameter} = :${parameter}`, { [parameter]: req.body[parameter] })

        } else if (req.body[parameter] > 0) {

            searchQuery.andWhere(`${searchParameter[parameter]}.${parameter} <= :${parameter}`, { [parameter]: req.body[parameter] })

        } else if (req.body[parameter] !== "" && req.body[parameter] !== null && req.body[parameter] !== undefined) {

            searchQuery.andWhere(`${searchParameter[parameter]}.${parameter} like :${parameter}`, { [parameter]: `%${req.body[parameter]}%` })

        }
    }

    const searchResponse = await searchQuery.getMany().catch((err) => {
        res.json(err)
    })

    res.json(searchResponse)

})
//? Just fetch created Locations from User
server.get("/userCreatedLocations", jwtTokenUberprufung, async (req: Request, res: Response) => {

    const userLocations = await getConnection()
        .getRepository(LocationPreview)
        .createQueryBuilder("preview") //*Alias für Einträge in LocationPreview
        .innerJoinAndSelect("preview.locationDetails", "details") //*Alias für Einträge in LocationPreview & LocationDetails
        .where("preview.userId = :userId", { userId: req["user"]["userId"] })
        .getMany()
        .catch((err) => {
            res.json("Fehler")
        })

    res.json(userLocations)

})
//? Save Favourite by location ID
server.put("/saveFavouriteLocations/:id", jwtTokenUberprufung, async (req: Request, res: Response) => {

    const favourites = await getConnection()
        .getRepository(UserData)
        .createQueryBuilder("user")
        .select("user.favourites")
        .where("user.id = :id", { id: req["user"]["userId"] })
        .getOne()

    let newArray = []

    if (favourites.favourites === "") {
        newArray.push(req.params.id)
    } else {
        newArray = JSON.parse(favourites.favourites)
        let duplicateCheck = newArray.some((entry) => {
            return entry === req.params.id
        })
        if (!duplicateCheck) {
            newArray.push(req.params.id)
        } else {
            res.json("Location ist bereits als Favourit gespeichert")
        }
    }

    const updateFavourites = await getConnection()
        .createQueryBuilder()
        .update(UserData)
        .set({ favourites: JSON.stringify(newArray) })
        .where("id = :id", { id: req["user"]["userId"] })
        .execute()

    res.json(`Zu Favouriten hinzugefügt: ${newArray}`)
})
//?Just return user favourites
server.get("/userFavourites", jwtTokenUberprufung, async (req: Request, res: Response) => {

    const listOfFavourites = await getConnection()
        .getRepository(UserData)
        .createQueryBuilder("user")
        .select("user.favourites")
        .where("user.id = :id", { id: req["user"]["userId"] })
        .getOne()
        .catch((err) => {
            res.json(err)
        })

    let favourites;

    if (listOfFavourites["favourites"] !== "") {
        favourites = JSON.parse(listOfFavourites["favourites"])
    } else {
        res.json("Keine Favouriten gespeichert")
    }

    const locationDetails = await getConnection()
        .getRepository(LocationPreview)
        .createQueryBuilder("preview") //*Alias für Einträge in LocationPreview
        .innerJoinAndSelect("preview.locationDetails", "details") //*Alias für Einträge in LocationPreview & LocationDetails
        .where("preview.id IN (:...id)", { id: favourites })
        .getMany()

    res.json(locationDetails)

})
//? Deletes users favourite
server.delete("/deleteUserFavourite/:id", jwtTokenUberprufung, async (req: Request, res: Response) => {

    const listOfUserFavourites = await getConnection()
        .getRepository(UserData)
        .createQueryBuilder("user")
        .select("user.favourites")
        .where("user.id = :id", { id: req["user"]["userId"] })
        .getOne()

    const newListOfUserFavourites = JSON.parse(listOfUserFavourites["favourites"]).filter((entry) => {
        return entry !== req.params.id
    })

    const updateFavourites = await getConnection()
        .createQueryBuilder()
        .update(UserData)
        .set({ favourites: JSON.stringify(newListOfUserFavourites) })
        .where("id = :id", { id: req["user"]["userId"] })
        .execute()

    res.json(newListOfUserFavourites)

})

// !API-Schnittstelle Locations ENDE //



server.listen(port, function () {
    console.log("event-server läuft")
})
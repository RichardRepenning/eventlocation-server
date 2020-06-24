import { Request, Response } from "express";
import { createConnection, Connection } from "typeorm";
import { getConnection, createQueryBuilder } from "typeorm";
import { LocationDetails } from './tables/details'
import { LocationPreview } from './tables/overview'
import "reflect-metadata";
import randomId from './randomGenerator'
import { UserData } from "./tables/userdata";
import { title } from "process";
import { privateEncrypt } from "crypto";

const express = require("express")
const bodyParser = require("body-parser")
const cors = require("cors")

const server = express()
const port = process.env.PORT || 3000

server.use(cors())
server.use(bodyParser.json())

//!Create TypeORM-Connection and Table
createConnection().then(conn => {
    console.log("Datenbank-Connection steht")
    console.log("randomId-Generator Test", randomId())
})







// !API-Schnittstelle Locations
server.get("/", (req: Request, res: Response) => {
    console.log("Server ist online !")
    res.send("Server ist online !")
})





server.get("/locationPreview", async (req: Request, res: Response) => {

    const locationPreview = await getConnection()
        .getRepository(LocationPreview)
        .createQueryBuilder("preview") //*Alias für Einträge in LocationPreview
        .getMany();

    res.send(locationPreview)
})

server.get("/locationDetails", async (req: Request, res: Response) => {

    const locationDetails = await getConnection()
        .getRepository(LocationPreview)
        .createQueryBuilder("preview") //*Alias für Einträge in LocationPreview
        .innerJoinAndSelect("preview.locationDetails", "details") //*Alias für Einträge in LocationPreview & LocationDetails
        .getMany();

    res.send(locationDetails)
})

server.post("/postLocation", async (req: Request, res: Response) => {

    let uniqueId = randomId()

    let userId

    if (req.body.userId === undefined || req.body.userId === null) {
        userId = "Gast"
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
        userId: userId
    }

    //     //*Fail-Log erstellen
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
        res.send(`Folgende Parameter fehlen: ${failResponse}`)
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
            res.send(err)
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
            res.send(err)
        })

    //*Berichterstattung
    const responseBody = {
        preview: locationPost,
        details: locationPostDetails,
        status: `Posted on ${new Date()}`
    }

    // res.send(responseBody)
    res.send(responseBody)
})


server.delete("/deleteLocation", async (req: Request, res: Response) => {

    if (req.body.id === undefined || req.body.id === null) {
        res.send("Bitte eine gültige ID angeben")
        return
    }

    await getConnection()
        .createQueryBuilder()
        .delete()
        .from(LocationPreview)
        .where("id = :id", { id: req.body.id })
        .execute()
        .catch((err) => {
            res.send(err)
        })

    await getConnection()
        .createQueryBuilder()
        .delete()
        .from(LocationDetails)
        .where("id = :id", { id: req.body.id })
        .execute()
        .catch((err) => {
            res.send(err)
        })

    res.send(`Location mit ID ${req.body.id} wurde erfolgreich gelöscht`)

})


server.put("/updateLocation", async (req: Request, res: Response) => {

    if (req.body.id === undefined || req.body.id === null) {
        res.send("Bitte eine gültige ID angeben")
        return
    }

    //*Templates zum Updaten
    const expectedBodyDetails = {

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
    }

    const expectedBodyPreview = {
        // id: null,
        title: null,
        bild: null,
        place: null,
        price: null,
    }
    //*Templates zum Updaten ENDE

    //!Erstelle Update-Objecte aus Template
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

    if (Object.keys(queryUpdaterPreview).length !== 0) {

        await getConnection()
            .createQueryBuilder()
            .update(LocationPreview)
            .set(queryUpdaterPreview)
            .where("id=:id", { id: req.body.id })
            .execute()
            .catch((err) => {
                res.send("Beim Updaten ist was schief gelaufen")
            })
    }
    if (Object.keys(queryUpdaterDetails).length !== 0) {

        await getConnection()
            .createQueryBuilder()
            .update(LocationDetails)
            .set(queryUpdaterDetails)
            .where("id = :id", { id: req.body.id })
            .execute()
            .catch((err) => {
                res.send("Beim Updaten ist was schief gelaufen")
            })
    }

    //! { bodyDetails: queryUpdaterDetails, bodyPreview: queryUpdaterPreview }
    res.send(`Location mit ID ${req.body.id} wurde erfolgreich angepasst !`)
})

server.post("/searchLocation", async (req: Request, res: Response) => {

    //!SearchParameter
    const searchParameter = {
        place: null,
        userId: null,
        title: null,
        id: null,
        price: null,
        date: null
    }

    for (let parameter in searchParameter) {
        if (req.body[parameter] === undefined || req.body[parameter] === null) {
            searchParameter[parameter] = ""
        }
        else {
            searchParameter[parameter] = req.body[parameter]
        }
        console.log(searchParameter)
    }

    const searchResponse = await getConnection()
        .getRepository(LocationPreview)
        .createQueryBuilder("preview")
        .where("preview.place like :place", { place: `%${searchParameter.place}%` })
        .andWhere("preview.userId like :userId", { userId: `%${searchParameter.userId}%` })
        .andWhere("preview.title like :title", { title: `%${searchParameter.title}%` })
        .andWhere("preview.id like :id", { id: `%${searchParameter.id}%` })
        .andWhere("preview.price like :price", { price: `%${searchParameter.price}%` })
        .andWhere("preview.date like :date", { date: `%${searchParameter.date}%` })
        .getMany()
        .catch((err) => {
            res.send(err)
        })

    res.send(searchResponse)
})


//? TODO
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

// server.post("/createUser", async (req: Request, res: Response) => {

//     let userId

//     if (req.body.id === undefined || req.body.id === null) {
//         userId = "Gast"
//     }

//     const userdata = {
//         id: userId, //User-ID default "Gast"
//         name: req.body.name,
//         passwort: req.body.passwort,
//         email: req.body.email,
//         status: req.body.status,
//         profilePicture: req.body.profilePicture,
//         businessLetter: req.body.businessLetter,
//         favourites: ""
//     }

//     await getConnection()
//         .createQueryBuilder()
//         .insert()
//         .into(UserData)
//         .values([
//             userdata
//         ])
//         .execute()
//         .catch((err) => {
//             res.send(err)
//         })

// })
//? TODO ENDE



// !API-Schnittstelle Locations ENDE








server.listen(port, function () {
    console.log("event-server läuft")
})
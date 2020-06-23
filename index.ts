import { Request, Response } from "express";
import { createConnection, Connection } from "typeorm";
import { getConnection, createQueryBuilder } from "typeorm";
import { LocationDetails } from './tables/details'
import { LocationPreview } from './tables/overview'
import "reflect-metadata";

const express = require("express")
const bodyParser = require("body-parser")

const server = express()
const port = process.env.PORT || 3000

server.use(bodyParser.json())

//!Create TypeORM-Connection and Table
createConnection().then(conn => {
    console.log("Datenbank-Connection steht")
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
        .innerJoinAndSelect("preview.details", "details") //*Alias für Einträge in LocationPreview & LocationDetails
        .getMany();

    res.send(locationDetails)
})
server.post("/post", async (req: Request, res: Response) => {

    const expectedBodyDetails = {
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
    }

    const expectedBodyPreview = {
        id: req.body.id,
        title: req.body.title,
        bild: req.body.bild,
        place: req.body.place,
        price: req.body.price,
        date: new Date()
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
            res.send("Uuupps, hier ist ein Fehler aufgetreten")
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
            res.send("Eintrag schon vorhanden")
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

server.delete("/delete", async (req: Request, res: Response) => {

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

    await getConnection()
        .createQueryBuilder()
        .delete()
        .from(LocationDetails)
        .where("id = :id", { id: req.body.id })
        .execute()

    res.send(`Location mit ID ${req.body.id} wurde erfolgreich gelöscht`)

})

server.put("/put", async (req: Request, res: Response) => {

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
// !API-Schnittstelle Locations ENDE

server.listen(port, function () {
    console.log("event-server läuft")
})
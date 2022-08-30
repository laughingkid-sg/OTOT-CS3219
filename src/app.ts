import express, { Express } from "express"
import { DateTime } from "luxon"

const app: Express = express()
const port = process.env.PORT || 8080
const { body, validationResult } = require("express-validator")

app.use(express.json())

app.get("/", (req, res) => {
    res.send("ok")
})

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`)
})

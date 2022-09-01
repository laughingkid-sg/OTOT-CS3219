import express, { Express } from "express";
import { DB } from "./db";
import routes from "./routes";

DB()
    .then(() => {
        console.log("Data Source has been initialized!");
    })
    .catch((err) => {
        console.error("Error during Data Source initialization", err);
    });

const app: Express = express();
const port = process.env.PORT || 8080;

app.use(express.json());

app.get("/", (req, res) => {
    res.send("ok");
});

routes.map((r) => {
    app.use("/api", r);
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});

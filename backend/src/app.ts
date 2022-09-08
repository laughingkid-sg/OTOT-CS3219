import cors from "cors";
import express, { Express } from "express";
import path from "path";
import { authorisation } from "./controllers/auth";
import { DB, simpleSeed } from "./db";
import routes from "./routes";
import { errorHandler } from "./utilis";

DB()
    .then(() => {
        simpleSeed();
        console.log("Data Source has been initialized!");
    })
    .catch((err) => {
        console.error("Error during Data Source initialization", err);
    });

const app: Express = express();
const port = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());
app.use(errorHandler);
app.use(express.static(path.join(__dirname, "frontend")));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "frontend", "index.html"));
});

app.use(authorisation);

routes.map((r) => {
    app.use("/api", r);
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});

export default app;

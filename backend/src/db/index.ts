import { User, Coin, Portfolio } from "./entities";
import { DataSource } from "typeorm";
require("dotenv").config();

const ds = new DataSource({
    type: "mssql",
    port: 1433,
    host: process.env.DATABASE_DBHOST!,
    username: process.env.DATABASE_USERNAME!,
    password: process.env.DATABASE_PASSWORD!,
    database: process.env.DATABASE_NAME!,
    synchronize: true,
    logging: false,
    entities: [User, Coin, Portfolio],
    subscribers: [],
    migrations: [],
    extra: {
        trustServerCertificate: true,
    }
});

const DB = async () => {
    if (!ds.isInitialized) {
        return ds.initialize();
    } else {
        return ds;
    }
};

const userRepo = () => ds.getRepository(User);
const coinRepo = () => ds.getRepository(Coin);
const portfolioRepo = () => ds.getRepository(Portfolio);

export { DB, ds, userRepo, coinRepo, portfolioRepo };
export * from "./entities/index";
export * from "./handlers/index";
export * from "./seed"

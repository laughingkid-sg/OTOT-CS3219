import { User, Coin, Portfolio } from "./entities";
import { DataSource } from "typeorm";
require("dotenv").config();

const AppDataSource = new DataSource({
    type: "mssql",
    host: process.env.DATABASE_DBHOST!,
    port: 1433,
    username: process.env.DATABASE_USERNAME!,
    password: process.env.DATABASE_PASSWORD!,
    database: process.env.DATABASE_NAME!,
    synchronize: true,
    logging: false,
    entities: [User, Coin, Portfolio],
    subscribers: [],
    migrations: [],
});

const DB = async () => {
    return AppDataSource.initialize();
};

const userRepo = () => AppDataSource.getRepository(User);

export { DB, AppDataSource, userRepo };
export * from "./entities/index";

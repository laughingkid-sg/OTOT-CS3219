import { RedisClientType, createClient } from "redis";
require("dotenv").config();

const redisConnection: RedisClientType = createClient({
    url: process.env.REDIS_SERVER,
});

export { redisConnection };

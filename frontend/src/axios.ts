import axios from "axios";
import { Buffer } from "buffer";

const basicAuth = Buffer.from(
    `${process.env.REACT_APP_BASIC_USERNAME!}:${process.env.REACT_APP_BASIC_PASSWORD!}`,
    "utf8",
).toString("base64");

const serverless = axios.create({
    baseURL: process.env.REACT_APP_SERVERLESS_URI!,
});

const webserver = axios.create({
    baseURL: process.env.REACT_APP_API_URI!,
    headers: { Authorization: `Basic ${basicAuth}` },
});

export default { serverless, webserver };

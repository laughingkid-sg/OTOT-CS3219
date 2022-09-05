import axios from "axios";

const serverless = axios.create({
    baseURL: process.env.REACT_APP_SERVERLESS_URI!,
});

const webserver = axios.create({
    baseURL: process.env.REACT_APP_API_URI!,
});

export default { serverless, webserver };

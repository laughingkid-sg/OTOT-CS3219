import { AzureFunction, Context, HttpRequest } from "@azure/functions";
const axios = require("axios").default;

type Coin = {
    id: string;
    coin_id: number;
    name: string;
    symobl: string;
    market_cap_rank: number;
    thumb: string;
    small: string;
    large: string;
    slug: string;
    price_btc: number;
    score: number;
};

type CoinWrapper = {
    item: Coin;
};

const COINGECKO_TRENDING_API = "https://api.coingecko.com/api/v3/search/trending";

const httpTrigger: AzureFunction = async function (
    context: Context,
    req: HttpRequest,
): Promise<void> {
    // context.log('HTTP trigger function processed a request.');
    // const name = (req.query.name || (req.body && req.body.name));
    // const responseMessage = name
    //     ? "Hello, " + name + ". This HTTP triggered function executed successfully."
    //     : "This HTTP triggered function executed successfully. Pass a name in the query string or in the request body for a personalized response.";

    const { data } = await axios.get(COINGECKO_TRENDING_API);
    const { coins }: { coins: CoinWrapper[] } = data;
    context.res = {
        // status: 200, /* Defaults to 200 */
        body: {
            coins: coins
                .map((coinWrapper) => coinWrapper.item)
                .filter((coin) => coin.market_cap_rank <= 150),
        },
    };
};

export default httpTrigger;

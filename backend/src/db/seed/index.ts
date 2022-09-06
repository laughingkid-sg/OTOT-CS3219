import { coinRepo, userRepo, User, Coin, ds } from "..";

const data: Coin[] = [
    {
        id: "binance-usd",
        symbol: "BUSD",
        name: "Binance USD",
    },
    {
        id: "bitcoin",
        symbol: "BTC",
        name: "Bitcoin",
    },
    {
        id: "bnb",
        symbol: "BNB",
        name: "Binance Coin",
    },
    {
        id: "cardano",
        symbol: "ADA",
        name: "Cardano",
    },
    {
        id: "ethereum",
        symbol: "ETH",
        name: "Ethereum",
    },
    {
        id: "polkadot",
        symbol: "DOT",
        name: "Polkadot",
    },
    {
        id: "solana",
        symbol: "SOL",
        name: "Solana",
    },
    {
        id: "tether",
        symbol: "USDT",
        name: "Tether",
    },
    {
        id: "usd-coin",
        symbol: "USDC",
        name: "USD Coin",
    },
    {
        id: "xrp",
        symbol: "XRP",
        name: "XRP",
    },
];

const simpleSeed = async () => {
    const result = await coinRepo().find({
        select: {
            id: true,
        },
    });

    const insert = data.filter((x) => !result.filter((y) => y.id === x.id).length);

    if (data.length > 0) {
        await ds.createQueryBuilder().insert().into(Coin).values(insert).execute();
    }

    const defaultUser = await userRepo().findOne({
        select: {
            email: true,
        },
        where: {
            email: "demo@cs3219.com",
        },
    });
    if (!defaultUser) {
      await ds.createQueryBuilder().insert().into(User).values({
        email: "demo@cs3219.com",
        password: "123456", // Stored in plain text for demo purpose 
        role: 1
      }).execute();
    }
};

export { simpleSeed };

import { coinRepo, userRepo, User, Coin, ds } from "..";
import { hashPassword } from "../../utilis";

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

const users = [
    {
        email: "user@cs3219.com",
        password: "123456789",
        role: 2,
    },
    {
        email: "admin@cs3219.com",
        password: "123456789",
        role: 0,
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

    for (const user of users) {
        const defaultUser = await userRepo().findOne({
            select: {
                email: true,
            },
            where: {
                email: user.email,
            },
        });
        if (!defaultUser) {
            await ds
                .createQueryBuilder()
                .insert()
                .into(User)
                .values({
                    email: user.email,
                    password: await hashPassword(user.password),
                    role: [user.role],
                })
                .execute();
        }
    }
};

export { simpleSeed };

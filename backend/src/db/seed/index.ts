import { userRepo, User, Coin, ds } from "..";
import { hashPassword } from "../../utilis";
import { coins } from "./crypto-list"

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
    // Seed Coin (BULK)
    await ds.createQueryBuilder().insert().into(Coin).values(coins).orIgnore().execute();

    // Seed User
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

import { coinRepo } from "..";

const getAllCoins = () =>
    coinRepo().find({
        select: {
            id: true,
            symbol: true,
            name: true,
            createDate: true,
            updateDate: true,
        },
    });

export { getAllCoins };

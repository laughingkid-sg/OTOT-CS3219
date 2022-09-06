import { Coin } from "./Coin"

export type Portfolio = {
    id: string;
    purchasePrice: number;
    quantity: number;
    createDate?: string;
    updateDate?: string;
    coin: Coin;
};

export type CreatePortfolio = Pick<Portfolio, "purchasePrice" | "quantity"> & {
    coin: string
}

export type UpdatePortfolio = CreatePortfolio & {
    id?: string
}
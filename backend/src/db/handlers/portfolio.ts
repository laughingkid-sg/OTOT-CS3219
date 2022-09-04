import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";
import { Portfolio, portfolioRepo, userRepo } from "..";
import { ds } from "..";

const createPortfolio = async (portfolio: QueryDeepPartialEntity<Portfolio>) => {
    const result = await ds
        .createQueryBuilder()
        .insert()
        .into(Portfolio)
        .values([portfolio])
        .returning(["id"])
        .execute();
    return result.raw[0];
};

const getAllPortfolio = async (email: string) => {
    // const userPorfolio = await userRepo()
    //     .createQueryBuilder("user")
    //     .innerJoinAndSelect("user.portfolios", "portfolios")
    //     .select(["user.email", "portfolios"])
    //     .where("user.email = :email", { email })
    //     .getOne();

    const userPorfolio = await userRepo().findOne({
        relations: {
            portfolios: {
                coin: true
            }
        },
        select: {
            email: true,
            portfolios: true,
        }, where: {
            email: email
        }
    })

    return userPorfolio;
};

const updatePortfolio = async (id: string, portfolio: QueryDeepPartialEntity<Portfolio>) => {
    const result = await ds
        .createQueryBuilder()
        .update(Portfolio)
        .set(portfolio)
        .where("id = :id", { id })
        .execute();

    return result;
};

const deletePortfolio = async (id: string, email: string) => {
    const result = await ds
        .createQueryBuilder()
        .delete()
        .from(Portfolio)
        .where("id = :id", { id })
        .andWhere("userEmail = :email", { email })
        .execute();

    return result;
};

export { createPortfolio, updatePortfolio, getAllPortfolio, deletePortfolio };

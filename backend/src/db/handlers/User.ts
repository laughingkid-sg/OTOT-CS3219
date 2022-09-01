import { AppDataSource, User, userRepo } from "..";

const createUser = async (user: User) => {
    const res = await AppDataSource.createQueryBuilder()
        .insert()
        .into(User)
        .values(user)
        .returning(["email"])
        .execute();

    user = res.raw[0];
    return user;
};

const getPasswordHash = async (email: string) => {
    const hashedPassword = await userRepo()
        .createQueryBuilder("user")
        .where("user.email = :email", { email })
        .getOne();

    return hashedPassword?.password;
}

export { createUser, getPasswordHash};

import { ds, User, userRepo } from "..";

const createUser = async (user: User) => {
    const res = await ds.createQueryBuilder()
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

const getAllUser = async () => {
    const users : User[] = await userRepo()
        .createQueryBuilder("user")
        .getMany();
    return users;
}

export { createUser, getPasswordHash, getAllUser};

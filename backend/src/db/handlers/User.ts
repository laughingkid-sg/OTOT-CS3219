import { ds, User, userRepo } from "..";

const findUserByEmail = async (email: string) => {
    return userRepo().findOneBy({
        email,
    });
};

const createUser = async (user: User) => {
    const res = await ds
        .createQueryBuilder()
        .insert()
        .into(User)
        .values(user)
        .returning(["email"])
        .execute();

    user = res.raw[0];
    return user;
};

const getUser = async (email: string) => {
    const user = await userRepo()
        .createQueryBuilder("user")
        .where("user.email = :email", { email })
        .getOne();

    return user;
};

const getAllUser = async () => {
    const users: User[] = await userRepo().createQueryBuilder("user").getMany();
    return users.map((user) => {
        return {
            email: user.email,
            role: user.role,
            createDate: user.createDate,
            updateDate: user.updateDate,
        };
    });
};

export { createUser, getUser, getAllUser, findUserByEmail };

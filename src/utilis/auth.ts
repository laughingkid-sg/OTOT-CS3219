import bcrypt from "bcrypt";

const hashPassword = (password: string) : Promise<string> => {
    return new Promise((resolve, reject) => {
        bcrypt.genSalt(8, (err, salt) => {
            if (err) {
                reject(err);
            }
            bcrypt.hash(password, salt, (err, hash) => {
                if (err) {
                    reject(err);
                }
                resolve(hash);
            });
        });
    });
};

const comparePassword = (password: string, hashed: string) => {
    return bcrypt.compare(password, hashed);
};

export { hashPassword, comparePassword };

import {
    Column,
    CreateDateColumn,
    Entity,
    JoinTable,
    ManyToMany,
    PrimaryColumn,
    UpdateDateColumn,
} from "typeorm";
import { Crypto } from "./";

enum Role {
    Admin,
    User,
}

@Entity()
export class User {
    @PrimaryColumn()
    email!: string;

    @Column()
    password!: string;

    @Column({default: 1})
    role?: Role

    @ManyToMany(() => Crypto)
    @JoinTable()
    cryptos?: Crypto[];

    @CreateDateColumn()
    createDate?: Date;

    @UpdateDateColumn()
    updateDate?: Date;
}

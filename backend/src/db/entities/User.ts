import {
    Column,
    CreateDateColumn,
    Entity,
    OneToMany,
    PrimaryColumn,
    UpdateDateColumn,
} from "typeorm";
import { Portfolio } from ".";

enum Role {
    ADMIN,
    DEMO_USER,
    STANDARD_USER,
}

@Entity()
export class User {
    @PrimaryColumn()
    email!: string;

    @Column()
    password!: string;

    @Column({ default: 2 })
    role?: Role;

    @OneToMany(() => Portfolio, (portfolio) => portfolio.user)
    portfolios?: Portfolio[];

    @CreateDateColumn()
    createDate?: Date;

    @UpdateDateColumn()
    updateDate?: Date;
}

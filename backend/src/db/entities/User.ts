import {
    Column,
    CreateDateColumn,
    Entity,
    OneToMany,
    PrimaryColumn,
    UpdateDateColumn,
} from "typeorm";
import { Portfolio } from ".";

export enum Role {
    ADMIN,
    DEMO_USER,
    STANDARD_USER,
}

@Entity()
export class User {
    @PrimaryColumn()
    email!: string;

    @Column({ nullable: false })
    password!: string;

    @Column({
        type: "enum",
        enum: Role,
        nullable: false,
        array: true,
        default: "{1}",
    })
    role?: Role[];

    @OneToMany(() => Portfolio, (portfolio) => portfolio.user)
    portfolios?: Portfolio[];

    @CreateDateColumn()
    createDate?: Date;

    @UpdateDateColumn()
    updateDate?: Date;
}

import {
    Column,
    CreateDateColumn,
    Entity,
    OneToMany,
    PrimaryColumn,
    UpdateDateColumn,
} from "typeorm";
import { Portfolio } from ".";

@Entity("coin")
export class Coin {
    @PrimaryColumn()
    id!: string;

    @Column()
    symbol!: string;

    @Column()
    name!: string;

    @OneToMany(() => Portfolio, (portfolios) => portfolios.coin)
    portfolios?: Portfolio[];

    @CreateDateColumn()
    createDate?: Date;

    @UpdateDateColumn()
    updateDate?: Date;
}

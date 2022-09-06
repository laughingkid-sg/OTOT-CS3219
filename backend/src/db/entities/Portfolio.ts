import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";
import { Coin, User } from ".";

@Entity("portfolio")
export class Portfolio {
    @PrimaryGeneratedColumn("uuid")
    id?: string;

    @Column()
    purchasePrice!: number;

    @Column({ type: "float" })
    quantity!: number;

    @ManyToOne(() => User, (user) => user.portfolios)
    user!: User;

    @ManyToOne(() => Coin, (coin) => coin.portfolios)
    coin!: Coin;

    @CreateDateColumn()
    createDate?: Date;

    @UpdateDateColumn()
    updateDate?: Date;
}

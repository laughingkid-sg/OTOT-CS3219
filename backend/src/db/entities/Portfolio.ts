import {
    Column,
    CreateDateColumn,
    Entity,
    JoinTable,
    ManyToMany,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";
import { Coin, User } from ".";

@Entity()
export class Portfolio {
    @PrimaryGeneratedColumn()
    id!: string;

    @Column()
    purchasePrice!: number;

    @Column({ type: "decimal" })
    quantity!: number;

    @ManyToOne(() => User, (user) => user.portfolios)
    user!: User;

    @ManyToMany(() => Coin)
    @JoinTable()
    coins?: Coin[];

    @CreateDateColumn()
    createDate?: Date;

    @UpdateDateColumn()
    updateDate?: Date;
}

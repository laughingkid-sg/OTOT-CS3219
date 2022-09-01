import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryColumn,
    UpdateDateColumn,
} from "typeorm";

@Entity()
export class Coin {
    @PrimaryColumn()
    id!: string;

    @Column()
    symbol!: string;

    @Column()
    name!: string;

    @CreateDateColumn()
    createDate?: Date;

    @UpdateDateColumn()
    updateDate?: Date;
}

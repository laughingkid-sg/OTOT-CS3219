import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryColumn,
    UpdateDateColumn,
} from "typeorm";

@Entity()
export class Crypto {
    @PrimaryColumn()
    id!: string;

    @Column({ type: "decimal" })
    quantity!: number;

    @CreateDateColumn()
    createDate?: Date;

    @UpdateDateColumn()
    updateDate?: Date;
}

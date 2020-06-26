
import { Entity, Column, PrimaryColumn } from "typeorm";

@Entity()
export class MessageCenter {

    @PrimaryColumn()
    id: string;
    @Column({ unique: true })
    messageId: string;
    @Column()
    date: Date;
    @Column()
    topic: string;
    @Column()
    message: string;
    @Column()
    createdByName: string
    @Column()
    createdById: string
    @Column()
    receivedByName: string
    @Column()
    receivedById: string
}
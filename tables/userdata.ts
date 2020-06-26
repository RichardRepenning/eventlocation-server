import { Entity, Column, PrimaryColumn } from "typeorm";

@Entity()
export class UserData {

    @PrimaryColumn()
    id: string;
    @Column({unique: true})
    username: string;
    @Column({ default: "" })
    vorname: string;
    @Column({ default: "" })
    nachname: string;
    @Column({ default: "" })
    strasse: string;
    @Column({ default: 0 })
    plz: number;
    @Column({ default: "" })
    ort: string;
    @Column()
    passwort: string;
    @Column({ unique: true })
    email: string;
    @Column()
    status: string; //defines private or business
    @Column({ default: "" })
    profilePicture: string;
    @Column({ default: "" })
    businessLetter: string; //Gewerbeschein
    @Column({ default: "" })
    favourites: string;
    @Column({ default: "" })
    receivedMessages: string;
    @Column({ default: "" })
    sentMessages: string;
    @Column({ default: "" })
    blockmessages: string;
    @Column()
    registerDate: Date
}
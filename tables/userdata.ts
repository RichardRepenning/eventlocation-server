import { Entity, Column, PrimaryColumn, ManyToMany, JoinTable, OneToOne, JoinColumn, OneToMany } from "typeorm";
import { LocationPreview } from './overview'

@Entity()
export class UserData {

    @PrimaryColumn()
    id: string;
    @Column()
    username: string;
    @Column()
    passwort: string;
    @Column()
    email: string;
    @Column()
    status: string; //defines private or business
    @Column()
    profilePicture: string;
    @Column()
    businessLetter: string; //Gewerbeschein
    @Column()
    favourites: string;
    @Column()
    ownLoacations: string;
}
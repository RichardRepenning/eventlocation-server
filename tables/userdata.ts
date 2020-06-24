import { Entity, Column, PrimaryColumn, ManyToMany, JoinTable, OneToOne, JoinColumn, OneToMany } from "typeorm";
import { LocationPreview } from './overview'

@Entity()
export class UserData {

    @PrimaryColumn()
    id: string;
    @Column()
    name: string;
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
    favourites: string[]
    // @Column()
    // ownLocations: string;
    
    //template
    // @Column()
    // date: Date;

    // @OneToOne(type => LocationDetails)
    // @JoinColumn({ name: 'id' })
    // details: LocationDetails;
    @OneToMany(type => LocationPreview, ownLocations => ownLocations.userId)
    ownLocations: LocationPreview[] //Zielspalte
}
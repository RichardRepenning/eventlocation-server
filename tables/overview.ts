import { Entity, Column, PrimaryColumn, ManyToMany, JoinTable, OneToOne, JoinColumn, ManyToOne } from "typeorm";
import { LocationDetails } from './details'
import { UserData } from "./userdata";

@Entity()
export class LocationPreview {

    @PrimaryColumn()
    id: string;
    @Column()
    title: string;
    @Column()
    bild: string;
    @Column()
    place: string;
    @Column()
    price: string;
    @Column()
    date: Date;
    // @Column()
    // userId: string;

    @OneToOne(type => LocationDetails)
    @JoinColumn({ name: 'id' })
    details: LocationDetails; //Zielspalte

    @ManyToOne(type => UserData, userId => userId.ownLocations)
    userId: UserData //Zielspalte
}
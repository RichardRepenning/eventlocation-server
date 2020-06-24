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
    price: number;
    @Column()
    date: Date;
    @Column()
    username: string;
    @Column()
    userId: string;

    @OneToOne(type => LocationDetails)
    @JoinColumn({ name: 'id' })
    locationDetails: LocationDetails; //Zielspalte
}
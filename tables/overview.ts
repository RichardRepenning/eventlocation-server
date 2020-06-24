import { Entity, Column, PrimaryColumn, ManyToMany, JoinTable, OneToOne, JoinColumn } from "typeorm";
import { LocationDetails } from './details'

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
    @Column()
    userId: string;

    @OneToOne(type => LocationDetails)
    @JoinColumn({ name: 'id' })
    details: LocationDetails;
}
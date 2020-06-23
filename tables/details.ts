import { Entity, Column, PrimaryColumn, ManyToMany, ManyToOne, JoinColumn, OneToOne } from "typeorm";
import { LocationPreview } from "./overview";

@Entity()
export class LocationDetails {

    @PrimaryColumn()
    id: number;
    @Column()
    description: string;
    @Column()
    squaremeter: number;
    @Column()
    persons: number;
    @Column()
    minimumConsumption: number;
    @Column()
    waterpipeline: boolean;
    @Column()
    power: boolean;
    @Column()
    sanitary: boolean;
    @Column()
    mobile: boolean;
    @Column()
    category: string;
    @Column()
    calendar: string;
}
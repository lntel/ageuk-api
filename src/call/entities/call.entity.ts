import { BaseEntity, Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Patient } from "../../patients/entities/patient.entity";
import { Staff } from "../../staff/entities/staff.entity";

@Entity()
export class Call extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: string;

    @Column()
    date: Date;

    @Column()
    time: string;

    @ManyToOne(() => Patient, patient => patient.calls, { eager: false })
    patient: Patient;

    @ManyToMany(() => Staff, staff => staff.calls, { eager: false })
    @JoinTable()
    staff: Staff[];

    @Column({ default: null })
    startTime: Date;

    @Column({ default: null })
    endTime: Date;

    @Column({ default: null })
    startTravelTime: Date;

    @Column({ default: null })
    endTravelTime: Date;

}

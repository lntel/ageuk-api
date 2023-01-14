import { Patient } from "src/patients/entities/patient.entity";
import { Staff } from "src/staff/entities/staff.entity";
import { BaseEntity, Column, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Call extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: string;

    @Column()
    time: string;

    @ManyToOne(() => Patient, patient => patient.calls)
    patient: Patient;

    @ManyToMany(() => Staff, staff => staff.calls)
    staff: Staff[];

}

import { Patient } from "src/patients/entities/patient.entity";
import { Staff } from "src/staff/entities/staff.entity";
import { BaseEntity, Column, CreateDateColumn, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

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

}

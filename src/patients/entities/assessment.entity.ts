import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Patient } from "./patient.entity";


@Entity()
export class Assessment extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: string;

    @Column({ type: 'boolean', default: false })
    dnacpr: boolean;

    @Column({ type: 'boolean', default: false })
    riskOfPressure: boolean;

    @Column({ type: 'boolean', default: false })
    reducedMobility: boolean;

    @Column({ type: 'boolean', default: false })
    marChart: boolean;

    @Column({ type: 'boolean', default: false })
    careAssistant: boolean;

    @Column({ type: 'boolean', default: false })
    pressureSore: boolean;

    @Column({ type: 'boolean', default: false })
    weightBear: boolean;

    @Column({ type: 'boolean', default: false })
    painSymptom: boolean;

    @Column({ type: 'boolean', default: false })
    medication: boolean;

    @Column({ type: 'boolean', default: false })
    syringeDriver: boolean;

    @Column({ type: 'date', nullable: true })
    syringeDriverSetupDate?: Date;

    @OneToOne(() => Patient, patient => patient.assessment, { onDelete: 'CASCADE' })
    @JoinColumn()
    patient: Patient;

}
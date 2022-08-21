import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Patient } from "./patient.entity";


@Entity()
export class Assessment extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: string;

    @Column({ type: 'boolean', default: false })
    hasDnacpr: boolean;

    @Column({ type: 'boolean', default: false })
    riskOfPressureSores: boolean;

    @Column({ type: 'boolean', default: false })
    reducedMobility: boolean;

    @Column({ type: 'boolean', default: false })
    medicationAssistant: boolean;

    @Column({ type: 'boolean', default: false })
    marChartInPlace: boolean;

    @Column({ type: 'boolean', default: false })
    personalCareAssistant: boolean;

    @Column({ type: 'boolean', default: false })
    pressureSores: boolean;

    @Column({ type: 'boolean', default: false })
    weightBearing: boolean;

    @Column({ type: 'boolean', default: false })
    painAndSymptomSupport: boolean;

    @Column({ type: 'boolean', default: false })
    medicationPresent: boolean;

    @Column({ type: 'boolean', default: false })
    syringeDriver: boolean;

    @Column({ type: 'date',  })
    syringeDriverInstallationDate?: Date;

    @OneToOne(() => Patient, patient => patient.assessment, { onDelete: 'CASCADE' })
    @JoinColumn()
    patient: Patient;

}
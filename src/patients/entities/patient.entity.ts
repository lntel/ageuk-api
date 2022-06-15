import { Column, Entity, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';
import { Diagnosis } from './diagnosis.entity';
import { Referral } from './referral.entity';

@Entity()
export class Patient {
  @PrimaryColumn()
  id: string;

  @Column()
  startDate: Date;

  @Column()
  firstName: string;

  @Column({ nullable: true })
  middleNames: string;

  @Column()
  surname: string;

  @Column()
  addressLine: string;

  @Column()
  city: string;

  @Column({ default: 'Northamptonshire' })
  county: string;

  @Column()
  postcode: string;

  @Column({ default: 'Weeks' })
  prognosis: string;

  @OneToOne(() => Referral, (referral) => referral.patient)
  referral: Referral;

  @OneToMany(() => Diagnosis, (diagnosis) => diagnosis.patient)
  diagnoses: Diagnosis[];
}

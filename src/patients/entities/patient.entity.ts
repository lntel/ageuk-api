import { Column, Entity, ManyToOne, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';
import { GP } from './gp.entity';
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

  @Column('text', { array: true })
  diagnoses: string[];

  @ManyToOne(() => GP, (gp) => gp.patients)
  generalPractioner: GP;

  @OneToOne(() => Referral, (referral) => referral.patient)
  referral: Referral;
}

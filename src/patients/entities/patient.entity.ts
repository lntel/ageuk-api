import { BaseEntity, Column, Entity, JoinColumn, JoinTable, ManyToOne, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';
import { GP } from '../../gp/entities/gp.entity';
import { Referral } from './referral.entity';

@Entity()
export class Patient extends BaseEntity {
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
  @JoinTable()
  generalPractioner: GP;

  @OneToOne(() => Referral, (referral) => referral.patient)
  @JoinColumn()
  referral: Referral;
}

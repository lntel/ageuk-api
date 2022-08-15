import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, JoinTable, ManyToOne, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';
import { GP } from '../../gp/entities/gp.entity';

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
  telephoneNumber: string;

  @Column()
  addressLine: string;

  @Column()
  dob: Date;

  @Column({ default: 'Unknown' })
  gpFullname: string;

  @Column()
  city: string;

  @Column({ default: 'Northamptonshire' })
  county: string;

  @Column()
  postcode: string;

  @Column()
  sixWeekReview: Date;

  // TODO Does the eight week period take place 8 weeks after beginning of care?
  @Column()
  eightWeekReview: Date;

  @Column({ default: 'Weeks' })
  prognosis: string;

  @Column('text', { array: true })
  diagnoses: string[];

  @ManyToOne(() => GP, (gp) => gp.patients)
  @JoinTable()
  generalPractioner: GP;

  @Column()
  referral: string;
}

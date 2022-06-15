import { BaseEntity, Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Patient } from './patient.entity';

@Entity()
export class Referral extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  date: Date;

  @Column()
  firstName: string;

  @Column()
  surname: string;

  @Column({ nullable: true })
  organisation: string;

  @OneToOne(() => Patient, (patient) => patient.referral)
  patient: Patient;
}

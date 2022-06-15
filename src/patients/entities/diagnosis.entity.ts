import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Patient } from './patient.entity';

@Entity()
export class Diagnosis {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  text: string;

  @ManyToOne(() => Patient, (patient) => patient.diagnoses)
  patient: Patient;
}

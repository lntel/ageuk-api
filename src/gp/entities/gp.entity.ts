import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Patient } from '../../patients/entities/patient.entity';

@Entity()
export class GP extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  phoneNumber: string;

  @Column()
  surgeryName: string;

  @Column()
  address: string;

  @OneToMany(() => Patient, (patient) => patient.generalPractioner)
  patients: Patient[];
}

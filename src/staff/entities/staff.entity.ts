import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Staff {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  forename: string;

  @Column()
  surname: string;

  @Column()
  dob: Date;

  @Column()
  password: string;

  @Column()
  emailAddress: string;
}

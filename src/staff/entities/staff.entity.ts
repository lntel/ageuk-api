import { Role } from 'src/roles/entities/role.entity';
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

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

  @ManyToOne(() => Role, role => role.staff)
  @JoinTable()
  role: Role;

}

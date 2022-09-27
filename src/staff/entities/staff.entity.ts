import { Role } from 'src/roles/entities/role.entity';
import { Notification } from 'src/notifications/entities/notification.entity';
import { BaseEntity, Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Staff extends BaseEntity {
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

  @ManyToOne(() => Role, role => role.staff, { eager: true })
  @JoinColumn()
  role: Role;

  @OneToMany(() => Notification, notification => notification.performedBy)
  notifications: Notification[];

}

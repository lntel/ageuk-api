import { Notification } from '../../notifications/entities/notification.entity';
import { Role } from '../../roles/entities/role.entity';
import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

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

  @OneToMany(() => Notification, notification => notification.staff)
  notifications: Notification[];

  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn()
  lastUpdated: Date;

}

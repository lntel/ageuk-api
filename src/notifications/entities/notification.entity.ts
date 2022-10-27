import { Staff } from '../../staff/entities/staff.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum NotificationVerbEnum {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
}

@Entity()
export class Notification extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({
    type: 'enum',
    enum: NotificationVerbEnum,
    nullable: true,
  })
  verb?: NotificationVerbEnum;

  @Column({
    nullable: true,
  })
  entityName?: string;

  @Column({
    nullable: true,
  })
  message?: string;

  @ManyToOne(() => Staff, (staff) => staff.notifications, {
    nullable: true
  })
  performedBy?: Staff;

  @Column({ default: false })
  system: boolean;

  @CreateDateColumn()
  createdAt: Date;
}

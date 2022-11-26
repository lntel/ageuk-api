import { Staff } from "../../staff/entities/staff.entity";
import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Notification extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: string;

    @Column()
    content: string;

    // Read receipts are disabled on system notifications
    @Column({
        default: false,
        nullable: true
    })
    read: boolean;
    
    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @ManyToOne(() => Staff, staff => staff.notifications, {
        nullable: true,
        onDelete: 'CASCADE'
    })
    staff: Staff;
}

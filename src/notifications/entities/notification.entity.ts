import { Staff } from "src/staff/entities/staff.entity";
import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Notification extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: string;

    @Column()
    content: string;

    @Column({
        default: false
    })
    read: boolean;
    
    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @ManyToOne(() => Staff, staff => staff.notifications)
    staff: Staff;
}

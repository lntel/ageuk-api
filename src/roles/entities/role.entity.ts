import { Staff } from "../../staff/entities/staff.entity";
import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { PermissionTypeEnum } from "../types/Permissions";

@Entity()
export class Role extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({
        type: 'enum',
        enum: PermissionTypeEnum,
        array: true,
        default: []
    })
    permissions: PermissionTypeEnum[];

    @CreateDateColumn()
    created: Date;

    @UpdateDateColumn()
    lastUpdated: Date;

    @OneToMany(() => Staff, staff => staff.role)
    staff: Staff[];

}

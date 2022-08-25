import { Staff } from "src/staff/entities/staff.entity";
import { BaseEntity, Column, Entity, JoinColumn, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";
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

    @OneToMany(() => Staff, staff => staff.role)
    staff: Staff[];

}

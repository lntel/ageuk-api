import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role } from './entities/role.entity';

@Injectable()
export class RolesService {
  private readonly logger = new Logger(RolesService.name);

  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  async create(createRoleDto: CreateRoleDto) {
    const exists = await this.roleRepository.findOne({
      where: {
        name: createRoleDto.name,
      },
    });

    if (exists)
      throw new HttpException(
        'This role already exists',
        HttpStatus.BAD_REQUEST,
      );

    const role = this.roleRepository.create({
      name: createRoleDto.name,
      permissions: createRoleDto.permissions,
    });

    return await role.save();
  }

  async findAll() {
    return await this.roleRepository.find({});
  }

  async findOne(id: number) {
    return await this.roleRepository.findOneBy({ id });
  }

  async update(id: number, updateRoleDto: UpdateRoleDto) {
    const role = await this.roleRepository.findOne({
      where: {
        id
      }
    });

    if(!role)
      throw new HttpException('This role does not exist', HttpStatus.NOT_FOUND);

    role.name = updateRoleDto.name || role.name;
    role.permissions = updateRoleDto.permissions || role.permissions;

    return await role.save();
  }

  async remove(id: number) {
    const role = await this.roleRepository.findOne({
      where: {
        id,
      },
      relations: ['staff'],
    });

    if (!role)
      throw new HttpException(
        'This role cannot be found',
        HttpStatus.NOT_FOUND,
      );

    if (role.staff && role.staff.length)
      throw new HttpException(
        'There are staff who still have this role, please rearrange their roles in-order to remove this role',
        HttpStatus.CONFLICT,
      );

    return await role.remove();
  }
}

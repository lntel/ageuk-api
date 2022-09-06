import { forwardRef, HttpException, HttpStatus, Inject, Injectable, NotFoundException, Request } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateStaffDto } from './dto/create-staff.dto';
import { UpdateStaffDto } from './dto/update-staff.dto';
import { Staff } from './entities/staff.entity';
import { compareSync, hashSync } from 'bcrypt';
import { RolesService } from 'src/roles/roles.service';

@Injectable()
export class StaffService {
  constructor(
    @InjectRepository(Staff)
    private readonly staffRepository: Repository<Staff>,
    @Inject(forwardRef(() => RolesService))
    private readonly rolesService: RolesService,
  ) {}

  async isEmailInUse(emailAddress: string) {
    return await this.staffRepository.findOne({
      where: {
        emailAddress,
      },
    });
  }

  async login(emailAddress: string, password: string) {
    const staff = await this.staffRepository.findOneBy({
      emailAddress,
    });

    if (!staff)
      return new HttpException(
        'This email address does not exist',
        HttpStatus.NOT_FOUND,
      );

    const result = compareSync(password, staff.password);

    if (!result)
      return new HttpException(
        'You have provided an incorrect password, try again',
        HttpStatus.UNAUTHORIZED,
      );

    return staff;
  }

  async create(createStaffDto: CreateStaffDto) {
    if (await this.isEmailInUse(createStaffDto.emailAddress))
      throw new HttpException(
        'This email is already in use',
        HttpStatus.CONFLICT,
      );

    createStaffDto.password = hashSync(createStaffDto.password, 12);

    return this.staffRepository.save(createStaffDto);
  }

  findAll() {
    return this.staffRepository.find({
      select: ['dob', 'emailAddress', 'forename', 'id', 'surname'],
    });
  }

  async findOne(id: number) {
    const staff = await this.staffRepository.findOne({
      where: {
        id,
      },
    });

    if (!staff)
      throw new HttpException('Staff member not found', HttpStatus.NOT_FOUND);

    return {
      ...staff,
      password: undefined
    };
  }

  async findOneBy(key: string, value: string) {
    const staff = await this.staffRepository.findOne({
      where: {
        [key]: value,
      },
      relations: ['role']
    });

    if (!staff)
      throw new HttpException('Staff member not found', HttpStatus.NOT_FOUND);

    return staff;
  }

  async update(id: number, updateStaffDto: UpdateStaffDto) {
    const staff = await this.staffRepository.findOne({
      where: {
        id,
      },
    });

    if (!staff)
      throw new HttpException(
        'This staff member does not exist',
        HttpStatus.NOT_FOUND,
      );

    if (updateStaffDto.roleId) {
      const role = await this.rolesService.findOne(updateStaffDto.roleId);

      if (!role)
        throw new HttpException(
          'This role does not exist',
          HttpStatus.NOT_FOUND,
        );

      staff.role = role;
    }

    staff.forename = updateStaffDto.forename || staff.forename;
    staff.surname = updateStaffDto.surname || staff.surname;
    staff.dob = updateStaffDto.dob || staff.dob;
    staff.password = updateStaffDto.password || staff.password;
    staff.emailAddress = updateStaffDto.emailAddress || staff.emailAddress;

    return {
      ...await staff.save(),
      password: undefined
    };
  }

  async remove(id: number) {
    const staff = await this.staffRepository.findOne({
      where: {
        id
      }
    });

    if(!staff)
      throw new NotFoundException();

    return this.staffRepository.remove(staff);
  }

  async getCurrentUser(user) {
    const staff = await this.staffRepository.findOne({
      where: {
        id: user.sub
      },
      relations: ['role']
    });

    return {
      ...staff,
      password: undefined
    };
  }
}

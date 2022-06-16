import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateStaffDto } from './dto/create-staff.dto';
import { LoginStaffDto } from './dto/login-staff.dto';
import { UpdateStaffDto } from './dto/update-staff.dto';
import { Staff } from './entities/staff.entity';
import { compareSync, hashSync } from 'bcrypt';

@Injectable()
export class StaffService {
  constructor(
    @InjectRepository(Staff)
    private readonly staffRepository: Repository<Staff>,
  ) {}

  async isEmailInUse(emailAddress: string) {
    return await this.staffRepository.findOne({
      where: {
        emailAddress,
      },
    });
  }

  async login(loginStaffDto: LoginStaffDto) {
    const staff = await this.staffRepository.findOneBy({
      emailAddress: loginStaffDto.emailAddress,
    });

    if (!staff)
      throw new HttpException(
        'This email address does not exist',
        HttpStatus.NOT_FOUND,
      );

    const result = compareSync(loginStaffDto.password, staff.password);

    if (!result)
      throw new HttpException(
        'You have provided an incorrect password, try again',
        HttpStatus.UNAUTHORIZED,
      );

    return 'Successfully signed in, please wait';
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
    return this.staffRepository.find({});
  }

  async findOne(id: number) {
    const staff = await this.staffRepository.findOne({
      where: {
        id,
      },
    });

    if (!staff)
      throw new HttpException('Staff member not found', HttpStatus.NOT_FOUND);

    return staff;
  }

  update(id: number, updateStaffDto: UpdateStaffDto) {
    return `This action updates a #${id} staff`;
  }

  async remove(id: number) {
    const staff = await this.findOne(id);

    return this.staffRepository.remove(staff);
  }
}

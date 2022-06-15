import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateStaffDto } from './dto/create-staff.dto';
import { UpdateStaffDto } from './dto/update-staff.dto';
import { Staff } from './entities/staff.entity';

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

  async create(createStaffDto: CreateStaffDto) {
    if (await this.isEmailInUse(createStaffDto.emailAddress))
      throw new HttpException(
        'This email is already in use',
        HttpStatus.CONFLICT,
      );

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

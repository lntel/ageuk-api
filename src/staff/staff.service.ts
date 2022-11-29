import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { compareSync, hashSync } from 'bcrypt';
import { unlinkSync } from 'fs';
import { join } from 'path';
import { Repository } from 'typeorm';
import { NotificationsService } from '../notifications/notifications.service';
import { RolesService } from '../roles/roles.service';
import { CreateStaffDto } from './dto/create-staff.dto';
import { UpdateStaffDto } from './dto/update-staff.dto';
import { Staff } from './entities/staff.entity';

@Injectable()
export class StaffService {
  constructor(
    @InjectRepository(Staff)
    private readonly staffRepository: Repository<Staff>,
    @Inject(forwardRef(() => RolesService))
    private readonly rolesService: RolesService,
    @Inject(forwardRef(() => NotificationsService))
    private readonly notificationService: NotificationsService,
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
      throw new HttpException(
        'This email address does not exist',
        HttpStatus.NOT_FOUND,
      );

    const result = compareSync(password, staff.password);

    if (!result)
      throw new HttpException(
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

    const role = await this.rolesService.findOne(createStaffDto.roleId);

    if (!role)
      throw new HttpException('This role does not exist', HttpStatus.NOT_FOUND);

    createStaffDto.password = hashSync(createStaffDto.password, 12);

    const staff = this.staffRepository.create({
      ...createStaffDto,
      role,
    });

    return this.staffRepository.save(staff);
  }

  findAll() {
    return this.staffRepository.find({
      select: ['dob', 'emailAddress', 'forename', 'id', 'surname', 'personalPhone', 'workPhone', 'avatarFilename'],
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
      password: undefined,
    };
  }

  async findOneBy(key: string, value: string) {
    const staff = await this.staffRepository.findOne({
      where: {
        [key]: value,
      },
      relations: ['role'],
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

      await this.notificationService.create({
        staff: staff.id,
        content: `Welcome to the ${role.name} team!`,
      });
    }

    // TODO write unit test for this section
    if(updateStaffDto.emailAddress && updateStaffDto.emailAddress != staff.emailAddress) {

      const emailExists = await this.isEmailInUse(updateStaffDto.emailAddress);

      if(emailExists) 
        throw new HttpException('This email is already in use, try another', HttpStatus.CONFLICT)
    }

    let { password } = updateStaffDto;

    password = password ? hashSync(password, 12) : null;

    staff.forename = updateStaffDto.forename || staff.forename;
    staff.surname = updateStaffDto.surname || staff.surname;
    staff.dob = updateStaffDto.dob || staff.dob;
    staff.password = password || staff.password;
    staff.emailAddress = updateStaffDto.emailAddress || staff.emailAddress;
    staff.personalPhone = updateStaffDto.personalPhone || staff.personalPhone;
    staff.workPhone = updateStaffDto.workPhone || staff.workPhone;

    // TODO add password reset message

    if (password)
      await this.notificationService.create({
        staff: staff.id,
        content: 'Your password has been updated',
      });

    return {
      ...(await staff.save()),
      password: undefined,
    };
  }

  async remove(user: any, id: number) {
    const staff = await this.staffRepository.findOne({
      where: {
        id,
      },
    });

    // Prevent the staff from deleting their own account
    const { sub } = user;

    if (!staff) throw new NotFoundException();

    if (sub === staff.id)
      throw new HttpException(
        'You cannot delete your own account',
        HttpStatus.CONFLICT,
      );

    return this.staffRepository.remove(staff);
  }

  async updateProfile(user: any, updateStaffDto: UpdateStaffDto) {
    const staff = await this.findOneBy('id', user.sub);

    const result = compareSync(updateStaffDto.password, staff.password);

    if (!result)
      throw new HttpException(
        'You have provided an incorrect password, try again',
        HttpStatus.FORBIDDEN,
      );

    await this.notificationService.create({
      staff: staff.id,
      content: 'Your profile has been updated'
    });

    return this.update(user.sub, {
      ...updateStaffDto,
      password: undefined,
    });
  }

  async getCurrentUser(user) {
    const staff = await this.staffRepository.findOne({
      where: {
        id: user.sub,
      },
      relations: ['role'],
    });

    // TODO maybe add an existence check here

    return {
      ...staff,
      password: undefined,
    };
  }

  async uploadAvatar(user: any, file: Express.Multer.File) {
    const staff = await this.findOneBy('id', user.sub);
    
    if (staff.avatarFilename)
      unlinkSync(join(__dirname, '../..', 'uploads', staff.avatarFilename));
    
    staff.avatarFilename = file.filename;
    
    await staff.save();

    await this.notificationService.create({
      staff: staff.id,
      content: 'Your profile picture has been updated'
    });
    
    return file;
  }
  
  async removeAvatar(user: any) {
    const staff = await this.findOneBy('id', user.sub);
    
    if (!staff.avatarFilename)
      throw new HttpException('Your profile does not have a profile image', HttpStatus.NOT_FOUND);
      
    unlinkSync(join(__dirname, '../..', 'uploads', staff.avatarFilename));
    
    staff.avatarFilename = null;

    const result = await staff.save();

    await this.notificationService.create({
      staff: staff.id,
      content: 'Your profile picture has been removed'
    });

    return {
      ...result,
      password: undefined
    };
  }
}

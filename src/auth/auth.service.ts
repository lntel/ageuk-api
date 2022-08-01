import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compareSync } from 'bcrypt';
import { StaffService } from 'src/staff/staff.service';

@Injectable()
export class AuthService {
    constructor(
        private staffService: StaffService,
        private jwtService: JwtService
    ) {}

    async validateStaff(emailAddress: string, password: string): Promise<any> {
        const staff = await this.staffService.findOneBy('emailAddress', emailAddress);

        if(staff && compareSync(password, staff.password)) {
            // Prevent the password being passed back
            const { password, ...result } = staff;

            return result;
        }
        
        return null;
    }

    async login(staff: any) {
        const payload = { emailAddress: staff.emailAddress, sub: staff.id };

        return {
            access_token: this.jwtService.sign(payload)
        };
    }
}

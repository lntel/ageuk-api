import { IsDefined, IsEmail, IsNotEmpty } from "class-validator";

class AuthLoginDTO {
    @IsDefined()
    @IsNotEmpty()
    @IsEmail({}, {
        message: 'The email address you entered is invalid'
    })
    emailAddress: string;

    @IsDefined()
    @IsNotEmpty()
    password: string;
}

export default AuthLoginDTO;
import { IsDefined, IsEmail, IsNotEmpty } from "class-validator";

class AuthLoginDTO {
    @IsDefined()
    @IsNotEmpty()
    @IsEmail()
    emailAddress: string;

    @IsDefined()
    @IsNotEmpty()
    password: string;
}

export default AuthLoginDTO;
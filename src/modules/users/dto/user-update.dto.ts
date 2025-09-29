import { IsNotEmpty, IsString, Matches, MinLength } from "class-validator";

export class UserUpdateDto {
    @IsString()
    @IsNotEmpty()
    username?: string;

    @IsString()
    @IsNotEmpty()
    email?: string

    @IsString()
    @IsNotEmpty()
    @MinLength(8)
    @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/, {
        message: 'Password must contain at least one letter, one number, and one special character',
    })
    password?: string;

    @IsString()
    role?: string
}

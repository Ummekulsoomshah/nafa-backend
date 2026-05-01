import { IsEmail, IsIn, IsOptional, IsString, Length, Matches } from "class-validator";

export class UserUpdateDto {
    @IsOptional()
    @IsString()
    @Length(6, 20, { message: 'Username must be between 6 and 20 characters' })
    @Matches(/^[a-zA-Z ]+$/, { message: 'Username can only contain letters and spaces' })
    username?: string;

    @IsOptional()
    @IsEmail({}, { message: 'Enter a valid email address' })
    email?: string;

    @IsOptional()
    @IsString()
    @Length(6, 15, { message: 'Password must be between 6 and 15 characters' })
    @Matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,15}$/, {
        message: 'Password must contain uppercase, lowercase, number and special character',
    })
    password?: string;

    @IsOptional()
    @IsString()
    @IsIn(['Low', 'Medium', 'High'], { message: 'Risk category must be Low, Medium or High' })
    riskCategory?: string;
}
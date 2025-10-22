import { IsNotEmpty, IsString, Matches, MinLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class UserLoginDto {
   
    
    @ApiProperty({ "example": 'john@gmail.com', description: 'Email', default: 'john@user api.com' })
    @Matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, { message: 'Invalid email format' })
    @IsString()
    @IsNotEmpty()
    email: string;

    @ApiProperty({ "example": 'Password@123', description: 'Password', default: 'Password@123' })
    @IsString()
    @IsNotEmpty()
    @MinLength(8)
    @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/, {
        message: 'Password must contain at least one letter, one number, and one special character',
    })
    password: string;

}
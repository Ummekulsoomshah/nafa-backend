import { Body, Controller, Get, Post } from "@nestjs/common";
import { UserService } from "./user.service";
import { UserCreateDto } from "./dto/user-create.dto";

@Controller('users')
export class UserController {
    constructor(
        private readonly userservice:UserService
    ){}

    @Post('register-user')
    async registerUser(@Body() usercreatedto:UserCreateDto) {
        return await this.userservice.registerUser(usercreatedto.email,usercreatedto.password,usercreatedto.role,usercreatedto.username);
    }


    @Get('get-users')
    getUser() {
        return "User details";
    }

    @Get('user/:id')
    getUserById() {
        return "User details by ID";
    }   
}
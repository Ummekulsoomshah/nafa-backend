import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { UserService } from "./user.service";
import { UserCreateDto } from "./dto/user-create.dto";
import { ApiTags } from "@nestjs/swagger";
import { AuthGuard } from "../auth/auth.guard";
import { RolesGuard } from "../auth/roles.guard";
import { Roles } from "../auth/roles.decorator";

@Controller('users')
export class UserController {
    constructor(
        private readonly userservice:UserService
    ){}

@ApiTags('example')
    @Post('register-user')
    async registerUser(@Body() usercreatedto:UserCreateDto) {
        return await this.userservice.registerUser(usercreatedto.email,usercreatedto.password,usercreatedto.role,usercreatedto.username);
    }

@ApiTags('example')
    @Get('get-users')
    async getUser() {
        return await this.userservice.findUsers() ;
    }

    @Get('user/:id')
    getUserById() {
        return "User details by ID";
    }  
    
    @UseGuards(AuthGuard,RolesGuard)
    @Roles('admin')
    @Get('admin-data')
    getAdminData() {
        return "Sensitive admin data";
    }
}
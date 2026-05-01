import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from "@nestjs/common";
import { UserService } from "./user.service";
import { UserCreateDto } from "./dto/user-create.dto";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { AuthGuard } from "../auth/auth.guard";
import { RolesGuard } from "../auth/roles.guard";
import { Roles } from "../auth/roles.decorator";
import { UserLoginDto } from "./dto/user-login.dto";
import { UserUpdateDto } from "./dto/user-update.dto";

@Controller('users')
export class UserController {
    constructor(
        private readonly userservice: UserService
    ) { }

    @ApiTags('user api')
    @Post('register-user')
    async registerUser(@Body() usercreatedto: UserCreateDto) {
        return await this.userservice.registerUser(usercreatedto.username, usercreatedto.email, usercreatedto.password, usercreatedto.role);
    }

    @Post('login')
    async logIn(@Body() usercreatedto: UserLoginDto) {
        return await this.userservice.logIn(usercreatedto.email, usercreatedto.password);
    }

    @Patch('update/:id')
    @ApiOperation({ summary: 'Update user profile' })
    async updateProfile(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UserUpdateDto,
    ) {
        console.log('Received update profile request for user ID:', id);
        return await this.userservice.updateProfile(id, dto);
    }

    @Delete('delete/:id')
@UseGuards(AuthGuard)
async deleteUser(@Param('id') id: string) {
  return this.userservice.deleteUser(+id);
}
    @ApiTags('user api')
    @Get('get-users')
    async getUser() {
        return await this.userservice.findUsers();
    }

    @Get('user/:id')
    @UseGuards(AuthGuard)
    getUserById(@Param('id', ParseIntPipe) id: number) {
        return this.userservice.findUser(id);
    }
    @ApiBearerAuth()
    @UseGuards(AuthGuard, RolesGuard)
    @Roles('admin')
    @Get('admin-data')
    getAdminData() {
        return "Sensitive admin data";
    }
}
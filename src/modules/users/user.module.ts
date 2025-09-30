import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { JwtModule } from "@nestjs/jwt";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { User } from "./entites/user.entity";
import { jwtConstants } from "src/constants/constants";

@Module({
    imports: [
        TypeOrmModule.forFeature([User]),
        JwtModule.register({
             global: true,
      secret: jwtConstants.secret,
    //   signOptions: { expiresIn: '60s' },
        }) 
    ],
    controllers: [UserController],
    providers: [UserService],
})
export class UserModule { }
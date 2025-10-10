import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./entites/user.entity";
import { Repository } from "typeorm";
import * as bcrypt from 'bcrypt';
import { JwtService } from "@nestjs/jwt";
import { emit } from "process";


@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User) private userRepository: Repository<User>,
        private jwtService: JwtService
    ) { }

    async registerUser(username: string, email: string, password: string, role: string): Promise<{ user: User, access_token: string }> {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = this.userRepository.create({ username, email, password: hashedPassword, role });
        const userResult = await this.userRepository.save(newUser);

        if (!userResult) {
            throw new Error('User registration failed');
        }
        const access_token = await this.jwtService.signAsync({ id: userResult.id, userRole: userResult.role });
        return { user: userResult, access_token };
    }

    async findUsers() {
        return await this.userRepository.find();
    }
    async logIn({ email, password }: { email: string, password: string }) {
        const user = await this.userRepository.findOne({ where: { email: email } })
        if (!user) {
            throw new Error('User not found')
        }
        const isAuth = await bcrypt.compare(password, user.password)
        if (!isAuth) {
            throw new Error('Invalid credentials')
        }
        const access_token = await this.jwtService.signAsync({ id: user.id, username: user.username, role: user.role })
        return { ...user, access_token };

    }

    async findUser(userId: number) {
        return await this.userRepository.findBy({ id: userId })
    }

}



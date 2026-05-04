import { ConflictException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./entites/user.entity";
import { Repository } from "typeorm";
import * as bcrypt from 'bcrypt';
import { JwtService } from "@nestjs/jwt";
import { emit } from "process";
import { UserUpdateDto } from "./dto/user-update.dto";
import { RiskAnswer } from "../riskProfiling/entities/risk-answer.entity";


@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User) private userRepository: Repository<User>,
                @InjectRepository(RiskAnswer) private quizRepository: Repository<RiskAnswer>,
          
        private jwtService: JwtService
    ) { }

    async registerUser(username: string, email: string, password: string, role: string): Promise<{ user: User, access_token: string }> {
    const existing = await this.userRepository.findOne({ where: { email } });
    if (existing) {
        throw new ConflictException('This email is already registered. Try logging in instead.');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = this.userRepository.create({ username, email, password: hashedPassword, role });
    const userResult = await this.userRepository.save(newUser);
    if (!userResult) {
        throw new InternalServerErrorException('Account creation failed. Please try again.');
    }
    const access_token = await this.jwtService.signAsync({ id: userResult.id, userRole: userResult.role });
    return { user: userResult, access_token };
}

    async updateProfile(id: number, dto: UserUpdateDto): Promise<Omit<User, 'password'>> {
      console.log('Updating profile for user ID:', id, 'with data:', dto);
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    // Check if email is taken by another user
    if (dto.email && dto.email !== user.email) {
      const emailExists = await this.userRepository.findOne({
        where: { email: dto.email },
      });
      if (emailExists) {
        throw new ConflictException('Email is already in use');
      }
    }

    // Hash password if provided
    if (dto.password) {
      dto.password = await bcrypt.hash(dto.password, 10);
    }

    // Only update fields that were actually sent
    if (dto.username)     user.username     = dto.username;
    if (dto.email)        user.email        = dto.email;
    if (dto.password)     user.password     = dto.password;
    if (dto.riskCategory) user.riskCategory = dto.riskCategory;

    await this.userRepository.save(user);

    // Return user without password
    const { password, ...result } = user;
    return result;
  }
  async deleteUser(id: number) {
  const user = await this.userRepository.findOne({ where: { id } });
  if (!user) throw new NotFoundException('User not found');
  await this.quizRepository.delete({ user: { id } });
  await this.userRepository.remove(user);
  return { message: 'Account deleted successfully' };
}

    async findUsers() {
        return await this.userRepository.find();
    }
    async logIn(email: string, password: string): Promise<{ id: number, email: string, access_token: string }> {
    const user = await this.userRepository.findOne({ 
        where: { email }, 
        select: ['id', 'email', 'password', 'username', 'role', 'riskCategory'] 
    });
    if (!user) {
        throw new UnauthorizedException('Incorrect email or password. Please try again.');
    }
    const isAuth = await bcrypt.compare(password, user.password);
    if (!isAuth) {
        throw new UnauthorizedException('Incorrect email or password. Please try again.');
    }
    const access_token = await this.jwtService.signAsync({ id: user.id, username: user.username, role: user.role });
    return { ...user, access_token };
}

    async findUser(userId: number) {
        return await this.userRepository.findBy({ id: userId })
    }

}



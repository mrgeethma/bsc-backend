import { Injectable, NotFoundException, ConflictException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User, UserRole } from '../entities';
import { RegisterDto, AdminRegisterDto } from '../auth/dto/auth.dto';

interface CreateUserData {
  name: string;
  email: string;
  mobile?: string;
  password: string;
  role: UserRole;
}

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserData): Promise<User> {
    const existingUser = await this.usersRepository.findOne({
      where: { email: createUserDto.email },
    }); 
    

    if (existingUser) {
      throw new ConflictException('Email already exists');
    } 
    

    const saltRounds = 12; // Number of salt rounds for bcrypt hashing. technically, higher the number, more secure but slower the hashing process will be. 12 means 2^12 = 4096 iterations. 
    const hashedPassword = await bcrypt.hash(createUserDto.password, saltRounds); //bcrypt.hash function takes the plain text password and the number of salt rounds as inputs and returns a promise that resolves to the hashed password.

    const user = this.usersRepository.create({
      ...createUserDto,
      password: hashedPassword,
      role: createUserDto.role,
    });

    return this.usersRepository.save(user);
  }

  async findByEmail(email: string): Promise<User | null> { 
    return this.usersRepository.findOne({ where: { email } });
  }

  async findById(id: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { id } });
  }

  async validatePassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);

  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find({
      select: ['id', 'name', 'email', 'mobile', 'role', 'isActive', 'createdAt'],
    }); // return all users but only with selected fields to avoid exposing sensitive information like passwords.
  }

  async updateProfile(id: string, updateData: Partial<User>): Promise<User> {
    await this.usersRepository.update(id, updateData);
    const updatedUser = await this.findById(id);
    
    if (!updatedUser) {
      throw new NotFoundException('User not found');
    }
    
    return updatedUser;
  }

  async deactivateUser(id: string): Promise<void> {
    const user  = await this.findById(id); // Check if user exists
    if (!user) {
      throw new NotFoundException('User not found');
    }
    user.isActive = false;
    await this.usersRepository.save(user);
  }

  async toggleActive(id: string): Promise<User> {
    const user = await this.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    
    user.isActive = !user.isActive;
    return this.usersRepository.save(user);
  }

  async updateLastLogin(id: string): Promise<void> {
    await this.usersRepository.update(id, { 
      lastLogin: new Date() 
    });
  }

  async resetPassword(userId: string, resetPasswordDto: { currentPassword: string; newPassword: string }): Promise<User> {
    const user = await this.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Verify current password
    const isCurrentPasswordValid = await this.validatePassword(
      resetPasswordDto.currentPassword,
      user.password,
    );

    if (!isCurrentPasswordValid) {
      throw new UnauthorizedException('Current password is incorrect');
    }

    // Hash the new password
    const saltRounds = 12;
    const hashedNewPassword = await bcrypt.hash(resetPasswordDto.newPassword, saltRounds);

    // Update the password
    await this.usersRepository.update(userId, { password: hashedNewPassword });

    // Return the updated user
    const updatedUser = await this.findById(userId);
    if (!updatedUser) {
      throw new NotFoundException('User not found after update');
    }

    return updatedUser;
  }

}


//service layer ekedi apata business logic ekata yanna kalin findOne method eka use krnna ona ekakda kyla mulin balanna(//unique wiya yuthu dewal existsda yanna check kirimedi(email exists, slug exists, findById, findByEmail, update waladi)).  ehemann eeka krnna(if not record found eka mulin execute krnna. if not found throw an error. else go to next steps). next step eka wdyta mkkhri hdaganna tyenwannn business logic ekata yanna kalin, api eeka mulin hadagegna variable eakakata aran inna ona elaga steps walata yanna kalin(slug, custome id code, password hashing etc).
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/users/user-dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcryptjs'
import { User } from 'src/users/user.entity';
import { ValidatedUser } from 'src/types/types';

@Injectable()
export class AuthService {
	constructor(private usersService: UsersService, private jwtService: JwtService) {}

	async login(userDto: CreateUserDto) {
		const user = await this.validate(userDto)
		return this.generateToken(user)
	}

	async registration(userDto: CreateUserDto) {	
		const candidate = await this.usersService.getUserByEmail(userDto.email)
		if (candidate) throw new Error(JSON.stringify({ error: "User already exists" }))
		const hashPassword = await bcrypt.hash(userDto.password, 5)
		const user = await this.usersService.createUser({ ...userDto, password: hashPassword })
		return this.generateToken(user)
	}

	private async generateToken(user: User) {
		const payload = { id: user.id, name: user.name, email: user.email }
		return {	token: this.jwtService.sign(payload)	}
	}

	private async validate(userDto: CreateUserDto) {
		const user = await this.usersService.getUserByEmail(userDto.email)
		const passwordEquals = await bcrypt.compare(userDto.password, user.password)
		if (user && passwordEquals) return user
		throw new UnauthorizedException({massage: 'Incorrect email or password'})
		
	}
}

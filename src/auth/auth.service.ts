import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/users/user-dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcryptjs'
import { User } from 'src/users/user.entity';

@Injectable()
export class AuthService {
	constructor(private usersService: UsersService, private jwtService: JwtService) {}

	async login(userDto: CreateUserDto) {
		const user = await this.validate(userDto)
		const token = this.generateToken(user)
		return {
			user: {id: user.id, name: user.name, email: user.email}, accessToken: token
		}
	}

	async registration(userDto: CreateUserDto) {	
		const candidate = await this.usersService.getUserByEmail(userDto.email)
		if (candidate) throw new Error(JSON.stringify({ error: "User already exists" }))
		const hashPassword = await bcrypt.hash(userDto.password, 5)
		const user = await this.usersService.createUser({ ...userDto, password: hashPassword })
		const token = this.generateToken(user)
		return {
			user: {id: user.id, name: user.name, email: user.email}, accessToken: token
		}
	}

	private async generateToken(user: User) {
		const payload = { id: user.id, name: user.name, email: user.email }
		const token = this.jwtService.sign(payload)
		return token
	}

	private async validate(userDto: CreateUserDto) {
		const user = await this.usersService.getUserByEmail(userDto.email)
		const passwordEquals = await bcrypt.compare(userDto.password, user.password)
		if (user && passwordEquals) return user
		throw new UnauthorizedException({massage: 'Incorrect email or password'})
		
	}
}

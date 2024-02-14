import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthUserDto, CreateUserDto } from 'src/users/user-dto/create-user.dto';
import { UsersService } from 'src/users/users.service';

@Controller('auth')
export class AuthController {
	constructor(private authService: AuthService, private usersServise: UsersService) { }
	
	@Post('login')
	async login(@Body() userDto: AuthUserDto) {
		const token = await this.authService.login(userDto)
		const user = await this.usersServise.getUserByEmail(userDto.email)
		return {accessToken: token.token, user: {name: user.name, email: user.email, isAuth: true}}
	}

	@Post('registration')
	async registration(@Body() userDto: CreateUserDto) {
		const token = await this.authService.registration(userDto)
		return {accessToken: token.token, user: {name: userDto.name, email: userDto.email, isAuth: true}}
	}
}

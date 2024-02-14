import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthUserDto, CreateUserDto } from 'src/users/user-dto/create-user.dto';

@Controller('auth')
export class AuthController {
	constructor(private authService: AuthService) { }
	
	@Post('login')
	async login(@Body() userDto: AuthUserDto) {
		return this.authService.login(userDto)
	}

	@Post('registration')
	async registration(@Body() userDto: CreateUserDto) {
		return this.authService.registration(userDto)
	}
}

import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common'
import { UsersService } from './users.service'
import { CreateUserDto } from './user-dto/create-user.dto'
import { User } from './user.entity'
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard'

@Controller('users')
export class UsersController {

	constructor(private usersService: UsersService) { }

	@UseGuards(JwtAuthGuard)
	@Get()
	async getUsers(): Promise<User[]> {
		return this.usersService.getUsers()
	}

	@Get(':id')
	async getUser(@Param('id') id: number): Promise<User> {
		return this.usersService.getUserById(id)
	}

	@Post()
	async createUser(@Body() userDto: CreateUserDto): Promise<User> {
		return this.usersService.createUser(userDto)
	}

	@Delete(':id') 
	async deleteUser(@Param('id') id: number): Promise<void> {
		return this.usersService.deleteUser(id)
	}
}

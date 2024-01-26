import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common'
import { UsersService } from './users.service'
import { CreateUserDto } from './dto/create-user.dto'

@Controller('users')
export class UsersController {

	constructor(private usersService: UsersService) {}

	@Get()
	getUsers() {
		return this.usersService.getUsers()
	}

	@Get(':id')
	getUser(@Param('id') id: number) {
		return this.usersService.getUserById(id)
	}

	@Post()
	createUser(@Body() userDto: CreateUserDto) {
		return this.usersService.createUser(userDto)
	}

	@Delete(':id') 
	deleteUser(@Param('id') id: number) {
		return this.usersService.deleteUser(id)
	}
}

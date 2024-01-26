import { Injectable } from '@nestjs/common'
import { CreateUserDto } from './dto/create-user.dto'
import { User } from './user.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

@Injectable()
export class UsersService {

	constructor(@InjectRepository(User) private usersRepository: Repository<User>) {}

	async getUsers(): Promise<User[]> {
		const users = await this.usersRepository.find()
		return users
	}

	async getUserById(id: number): Promise<User> {
		const user = await this.usersRepository.findOne({where: {id}})
		return user
	}

	async createUser(dto: CreateUserDto): Promise<User> {
		const newUser = this.usersRepository.create(dto)
		return await this.usersRepository.save(newUser)
	}
	
	async deleteUser(id: number): Promise<void> {
		await this.usersRepository.delete(id)
	}
}

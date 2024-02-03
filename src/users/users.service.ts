import { Injectable } from '@nestjs/common'
import { CreateUserDto } from './dto/create-user.dto'
import { User } from './user.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CreateNoteDto } from 'src/note/dto/create-note.dto'
import { Note } from 'src/note/note.entity'

@Injectable()
export class UsersService {

	constructor(@InjectRepository(User) private usersRepository: Repository<User>,
		@InjectRepository(Note) private noteRepository: Repository<Note>) { }

	async getUsers(): Promise<User[]> {
		const users = await this.usersRepository.find()
		return users
	}

	async getUserById(id: number): Promise<User> {
		const user = await this.usersRepository.findOne({where: {id}, relations: ["folders", "notes"]})
		return user
	}

	async createUser(dto: CreateUserDto): Promise<User> {
		const newUser = this.usersRepository.create(dto)
		return await this.usersRepository.save(newUser)
	}
	
	async deleteUser(id: number): Promise<void> {
		await this.usersRepository.delete(id)
	}

	async createNote(userId: number, noteDto: CreateNoteDto) {
		const user = await this.getUserById(userId)
		if (!user) throw new Error(JSON.stringify({error: "User not found"}))
		const newNote = this.noteRepository.create({
			user: user,
			title: noteDto.title,
			content: noteDto.content
		})
		return await this.noteRepository.save(newNote)
	}
}

import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Note } from './note.entity'
import { Repository } from 'typeorm'
import { User } from 'src/users/user.entity'
import { CreateNoteDto } from './dto/create-note.dto'
import { UsersService } from 'src/users/users.service'

@Injectable()
export class NoteService {
	constructor(@InjectRepository(Note) private noteRepository: Repository<Note>,
		private usersService: UsersService) { }

	async getNotes(): Promise<Note[]> {
		const notes = await this.noteRepository.find()
		return notes
	}

	async getNoteById(id: number): Promise<Note> {
		const note = await this.noteRepository.findOne({ where: { id }, relations: [] })
		return note
	}

	async getAllUserNotes(userId: number): Promise<Note[]> {
		const user = await this.usersService.getUserById(userId)
		if (!user) throw new Error(JSON.stringify({ error: "User not found" }))
		const notes = await this.noteRepository
			.createQueryBuilder('note')
			.where('note.user.id = :userId', { userId })
			.getMany()
		return notes
	}

	async getUserNote(userId: number, noteId: number): Promise<Note> {
		const user = await this.usersService.getUserById(userId)
		if (!user) throw new Error(JSON.stringify({ error: "User not found" }))
		const note = await this.noteRepository
			.createQueryBuilder('note')
			.where('note.user.id = :userId', { userId })
			.andWhere('note.id = :noteId', { noteId })
			.getOne()
		return note
	}

	async updateNote(userId: number, noteId: number, updatedData: Partial<Note>): Promise<Note> {
		const note = await this.getUserNote(userId, noteId)
		if (!note) throw new Error(JSON.stringify({ error: "Note or user not found" }))
		if (updatedData.title) note.title = updatedData.title
		if (updatedData.content) note.content = updatedData.content
		return this.noteRepository.save(note)
	}

	async deleteNote(id: number): Promise<void> {
		await this.noteRepository.delete(id)
	}
}

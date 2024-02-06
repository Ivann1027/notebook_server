import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Note } from './note.entity'
import { In, Repository } from 'typeorm'
import { User } from '../user.entity'
import { CreateNoteDto } from './note-dto/create-note.dto'
import { Folder } from 'src/users/folders/folder.entity'

@Injectable()
export class NoteService {
	constructor(@InjectRepository(Note) private noteRepository: Repository<Note>,
		@InjectRepository(User) private usersRepository: Repository<User>,
		@InjectRepository(Folder) private foldersRepository: Repository<Folder>
	) { }

	async getAllNotes(userId: number): Promise<Note[]> {
		const notes = await this.noteRepository
			.createQueryBuilder('note')
			.where('note.user.id = :userId', { userId })
			.getMany()
		return notes
	}

	async getUserNote(userId: number, noteId: number): Promise<Note> {
		const note = await this.noteRepository
			.createQueryBuilder('note')
			.where('note.user.id = :userId', { userId })
			.andWhere('note.id = :noteId', { noteId })
			.getOne()
		if (!note) throw new Error(JSON.stringify({error: "Note not found"}))
		return note
	}

	async deleteNote(userId: number, noteId: number): Promise<void> {
		const noteToRemove = await this.getUserNote(userId, noteId)
		await this.noteRepository.remove(noteToRemove)
	}

	async createNote(userId: number, noteDto: CreateNoteDto): Promise<Note> {
		const user = await this.usersRepository.findOne({ where: { id: userId } })
		if (!user) throw new Error(JSON.stringify({error: "User not found"}))
		const newNote = this.noteRepository.create({
			user: user,
			title: noteDto.title,
			content: noteDto.content
		})
		return await this.noteRepository.save(newNote)
	}

	async updateNote(userId: number, noteId: number, updatedData: Partial<Note>): Promise<Note> {
		const note = await this.getUserNote(userId, noteId)
		if (!note) throw new Error(JSON.stringify({ error: "Note not found" }))
		if (updatedData.title) note.title = updatedData.title
		if (updatedData.content) note.content = updatedData.content
		return this.noteRepository.save(note)
	}

	// ВАЖНО
	async createNoteInFolder(userId: number, folderId: number, noteDto: CreateNoteDto): Promise<Note> {
		const newNote = await this.createNote(userId, noteDto)
		const folder = await this.foldersRepository.findOne({ where: { id: folderId }, relations: ['notes'] })
		folder.notes.push(newNote)
		await this.foldersRepository.save(folder)
		return newNote
	}
	// ВАЖНО
}

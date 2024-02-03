import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Note } from './note.entity'
import { Repository } from 'typeorm'

@Injectable()
export class NoteService {
	constructor(@InjectRepository(Note) private noteRepository: Repository<Note>) { }

	async getAllNotes(userId: number): Promise<Note[]> {
		const notes = await this.noteRepository
			.createQueryBuilder('note')
			.where('note.user.id = :userId', { userId })
			.getMany()
		return notes
	}

	async getNote(userId: number, noteId: number): Promise<Note> {
		const note = await this.noteRepository
			.createQueryBuilder('note')
			.where('note.user.id = :userId', { userId })
			.andWhere('note.id = :noteId', { noteId })
			.getOne()
		return note
	}
}

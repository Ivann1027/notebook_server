import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common'
import { NoteService } from './note.service'
import { CreateNoteDto } from './dto/create-note.dto'
import { Note } from './note.entity'

@Controller('notes')
export class NoteController {
	constructor(private noteService: NoteService) { }

	@Get()
	async getNotes(): Promise<Note[]> {
		return this.noteService.getNotes()
	}

	@Get(':id')
	async getNote(@Param('id') id: number): Promise<Note> {
		return this.noteService.getNoteById(id)
	}

	@Delete(':id')
	async deleteNote(@Param('id') id: number): Promise<void> {
		return this.noteService.deleteNote(id)
	}
}

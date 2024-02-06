import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common'
import { NoteService } from './note.service';
import { Note } from './note.entity';
import { CreateNoteDto } from './note-dto/create-note.dto';

@Controller('users')
export class UsersNotesController {
	constructor(private noteService: NoteService) { }

	@Post(':id/notes')
	async createNote(@Param('id') userId: number, @Body() noteDto: CreateNoteDto): Promise<Note> {
		return this.noteService.createNote(userId, noteDto)
	}

	@Get(':id/notes')
	async getAllNotes(@Param('id') userId: number): Promise<Note[]> {
		return this.noteService.getAllNotes(userId)
	}

	@Get(':id/notes/:noteId')
	async getNote(@Param('id') userId: number, @Param('noteId') noteId: number): Promise<Note> {
		return this.noteService.getUserNote(userId, noteId)
	}

	@Put(':id/notes/:noteId')
	async updateNote(@Param('id') userId: number, @Param('noteId') noteId: number, @Body() updatedData: Partial<Note>): Promise<Note> {
		return this.noteService.updateNote(userId, noteId, updatedData)
	}
	
	@Delete(':id/notes/:noteId')
	async deleteNote(@Param('id') userId: number, @Param('noteId') noteId: number): Promise<void> {
		return this.noteService.deleteNote(userId, noteId)
	}
}

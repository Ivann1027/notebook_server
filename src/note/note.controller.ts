import { Controller, Delete, Param } from '@nestjs/common'
import { NoteService } from './note.service';

@Controller('notes')
export class NoteController {
	constructor(private noteService: NoteService) { }
	
	@Delete(':noteId')
	async deleteNote(@Param('noteId') noteId: number): Promise<void> {
		return this.noteService.deleteNote(noteId)
	}
}

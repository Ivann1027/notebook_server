import { Controller, Delete, Param, Put, Get, Post, Body } from '@nestjs/common'
import { FolderService } from './folder.service';
import { Folder } from './folder.entity';
import { Note } from '../notes/note.entity';
import { CreateNoteDto } from '../notes/note-dto/create-note.dto';
import { NoteService } from '../notes/note.service';
import { CreateFolderDto } from './folder-dto/create-folder.dto';

@Controller('users')
export class UsersFoldersController {
	constructor(private folderService: FolderService, private noteService: NoteService) { }

	@Post(':id/folders')
	async createFolder(@Param('id') userId: number, @Body() folderDto: CreateFolderDto): Promise<Folder> {
		return this.folderService.createFolder(userId, folderDto)
	}

	@Get(':id/folders')
	async getAllFolders(@Param('id') userId: number): Promise<Folder[]> {
		return this.folderService.getAllFolders(userId)
	}

	@Get(':id/folders/:folderId')
	async getFolder(@Param('id') userId: number, @Param('folderId') folderId: number): Promise<Folder> {
		return this.folderService.getUserFolder(userId, folderId)
	}

	@Put(':id/folders/:folderId')
	async renameFolder(@Param('id') userId: number, @Param('folderId') folderId: number, @Body() updatedData: Partial<Folder>): Promise<Folder> {
		return this.folderService.renameFolder(userId, folderId, updatedData)
	}

	@Put(':id/folders/:folderId/notes/:noteId')
	async addNoteToFolder(@Param('id') userId: number, @Param('folderId') folderId: number, @Param('noteId') noteId: number): Promise<Folder> {
		return this.folderService.addNoteToFolder(userId, folderId, noteId)
	}

	@Post(':id/folders/:folderId/notes')
	async createNoteInFolder(@Param('id') userId: number, @Param('folderId') folderId: number, @Body() noteDto: CreateNoteDto): Promise<Note> {
		return this.noteService.createNoteInFolder(userId, folderId, noteDto)
	}

	@Get(':id/folders/:folderId/notes')
	async getAllFolderNotes(@Param('id') userId: number, @Param('folderId') folderId: number): Promise<Note[]> {
		return this.folderService.getAllFolderNotes(userId, folderId)
	}

	@Get(':id/folders/:folderId/notes/:noteId')
	async getFolderNote(@Param('id') userId: number, @Param('folderId') folderId: number, @Param('noteId') noteId: number): Promise<Note> {
		return this.folderService.getFolderNote(userId, folderId, noteId)
	}

	@Delete(':id/folders/:folderId/notes/:noteId')
	async deleteNoteFromFolder(@Param('id') userId: number, @Param('folderId') folderId: number, @Param('noteId') noteId: number): Promise<Folder> {
		return this.folderService.deleteNoteFromFolder(userId, folderId, noteId)
	}
	
	@Delete(':id/folders/:folderId')
	async deleteFolder(@Param('id') userId: number, @Param('folderId') folderId: number): Promise<void> {
		return this.folderService.deleteFolder(userId, folderId)
	}
}

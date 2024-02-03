import { Controller, Post, Get, Body, Param, Delete, Put } from '@nestjs/common'
import { FolderService } from './folder.service'
import { CreateFolderDto } from './dto/create-folder.dto'
import { Folder } from './folder.entity'
import { NoteService } from 'src/note/note.service'

@Controller('folders')
export class FolderController {
	constructor(private readonly folderService: FolderService, private readonly noteService: NoteService) { }
	
	@Post()
	async create(@Body() folderDto: CreateFolderDto): Promise<Folder> {
		return this.folderService.createFolder(folderDto)
	}

	@Get()
	async getFolders(): Promise<Folder[]> {
		return this.folderService.getFolders()
	}

	@Get(':id')
	async getFolder(@Param('id') id: number): Promise<Folder> {
		return this.folderService.getFolderById(id)
	}

	@Put(':id/addNote/:noteId')
	async addNoteToFolder(@Param('id') folderId: number, @Param('noteId') noteId: number): Promise<Folder> {
		return this.folderService.addNoteToFolder(folderId, noteId)
	}

	@Delete(':id')
	async deleteFolder(@Param('id') id: number): Promise<void> {
		return this.folderService.deleteFolder(id)
	}
}

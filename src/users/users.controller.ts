import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common'
import { UsersService } from './users.service'
import { CreateUserDto } from './dto/create-user.dto'
import { FolderService } from 'src/folder/folder.service'
import { User } from './user.entity'
import { Folder } from 'src/folder/folder.entity'
import { Note } from 'src/note/note.entity'
import { NoteService } from 'src/note/note.service'
import { CreateNoteDto } from 'src/note/dto/create-note.dto'
import { CreateFolderDto } from 'src/folder/dto/create-folder.dto'

@Controller('users')
export class UsersController {

	constructor(private usersService: UsersService, private foldersService: FolderService, private noteService: NoteService) { }

	// USER
	@Get()
	async getUsers(): Promise<User[]> {
		return this.usersService.getUsers()
	}

	@Get(':id')
	async getUser(@Param('id') id: number): Promise<User> {
		return this.usersService.getUserById(id)
	}

	@Post()
	async createUser(@Body() userDto: CreateUserDto): Promise<User> {
		return this.usersService.createUser(userDto)
	}

	@Delete(':id') 
	async deleteUser(@Param('id') id: number): Promise<void> {
		return this.usersService.deleteUser(id)
	}

	// NOTES 
	@Post(':id/notes')
	async createNote(@Param('id') userId: number, @Body() noteDto: CreateNoteDto): Promise<Note> {
		return this.usersService.createNote(userId, noteDto)
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
		return this.usersService.updateNote(userId, noteId, updatedData)
	}

	// FOLDERS
	@Post(':id/folders')
	async createFolder(@Param('id') userId: number, @Body() folderDto: CreateFolderDto): Promise<Folder> {
		return this.usersService.createFolder(userId, folderDto)
	}

	@Get(':id/folders')
	async getAllFolders(@Param('id') userId: number): Promise<Folder[]> {
		return this.foldersService.getAllFolders(userId)
	}

	@Get(':id/folders/:folderId')
	async getFolder(@Param('id') userId: number, @Param('folderId') folderId: number): Promise<Folder> {
		return this.foldersService.getUserFolder(userId, folderId)
	}

	@Put(':id/folders/:folderId')
	async renameFolder(@Param('id') userId: number, @Param('folderId') folderId: number, @Body() updatedData: Partial<Folder>): Promise<Folder> {
		return this.usersService.renameFolder(userId, folderId, updatedData)
	}

	@Put(':id/folders/:folderId/notes/:noteId')
	async addNoteToFolder(@Param('id') userId: number, @Param('folderId') folderId: number, @Param('noteId') noteId: number): Promise<Folder> {
		return this.usersService.addNoteToFolder(userId, folderId, noteId)
	}

	@Post(':id/folders/:folderId/notes')
	async createNoteInFolder(@Param('id') userId: number, @Param('folderId') folderId: number, @Body() noteDto: CreateNoteDto): Promise<Note> {
		return this.usersService.createNoteInFolder(userId, folderId, noteDto)
	}

	@Get(':id/folders/:folderId/notes')
	async getAllFolderNotes(@Param('id') userId: number, @Param('folderId') folderId: number): Promise<Note[]> {
		return this.foldersService.getAllFolderNotes(userId, folderId)
	}

	@Get(':id/folders/:folderId/notes/:noteId')
	async getFolderNote(@Param('id') userId: number, @Param('folderId') folderId: number, @Param('noteId') noteId: number): Promise<Note> {
		return this.foldersService.getFolderNote(userId, folderId, noteId)
	}

	@Delete(':id/folders/:folderId/notes/:noteId')
	async deleteNoteFromFolder(@Param('id') userId: number, @Param('folderId') folderId: number, @Param('noteId') noteId: number): Promise<Folder> {
		return this.foldersService.deleteNoteFromFolder(userId, folderId, noteId)
	}
}

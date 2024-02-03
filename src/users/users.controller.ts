import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common'
import { UsersService } from './users.service'
import { CreateUserDto } from './dto/create-user.dto'
import { FolderService } from 'src/folder/folder.service'
import { User } from './user.entity'
import { Folder } from 'src/folder/folder.entity'
import { Note } from 'src/note/note.entity'
import { NoteService } from 'src/note/note.service'
import { CreateNoteDto } from 'src/note/dto/create-note.dto'

@Controller('users')
export class UsersController {

	constructor(private usersService: UsersService, private foldersService: FolderService, private noteService: NoteService) { }

	@Get()
	async getUsers(): Promise<User[]> {
		return this.usersService.getUsers()
	}

	@Get(':id')
	async getUser(@Param('id') id: number): Promise<User> {
		return this.usersService.getUserById(id)
	}

	@Post(':id/notes')
	async createNote(@Param('id') userId: number, @Body() noteDto: CreateNoteDto) {
		return this.usersService.createNote(userId, noteDto)
	}

	@Get(':id/folders')
	async getUserFolders(@Param('id') userId: number): Promise<Folder[]> {
		return this.foldersService.getFoldersByUser(userId)
	}

	@Get(':id/folders/:folderId')
	async getUserFolder(@Param('id') userId: number, @Param('folderId') folderId: number): Promise<Folder> {
		return this.foldersService.getFolderByUserIdAndFolderId(userId, folderId)
	}

	@Get(':id/folders/:folderId/notes')
	async getUserFolderNotes(@Param('id') userId: number, @Param('folderId') folderId: number): Promise<Note[]> {
		return this.foldersService.getUserNotesFromFolder(userId, folderId)
	}

	@Get(':id/notes')
	async getAllUserNotes(@Param('id') userId: number): Promise<Note[]> {
		return this.noteService.getAllUserNotes(userId)
	}

	@Get(':id/notes/:noteId')
	async getUserNote(@Param('id') userId: number, @Param('noteId') noteId: number): Promise<Note> {
		return this.noteService.getUserNote(userId, noteId)
	}

	@Put(':id/notes/:noteId')
	async updateNote(@Param('id') userId: number, @Param('noteId') noteId: number, @Body() updatedData: Partial<Note>): Promise<Note> {
		return this.noteService.updateNote(userId, noteId, updatedData)
	}

	@Post()
	async createUser(@Body() userDto: CreateUserDto): Promise<User> {
		return this.usersService.createUser(userDto)
	}

	@Delete(':id') 
	async deleteUser(@Param('id') id: number): Promise<void> {
		return this.usersService.deleteUser(id)
	}
}

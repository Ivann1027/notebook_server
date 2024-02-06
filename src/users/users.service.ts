import { Injectable } from '@nestjs/common'
import { CreateUserDto } from './dto/create-user.dto'
import { User } from './user.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CreateNoteDto } from 'src/note/dto/create-note.dto'
import { Note } from 'src/note/note.entity'
import { CreateFolderDto } from 'src/folder/dto/create-folder.dto'
import { Folder } from 'src/folder/folder.entity'
import { FolderService } from 'src/folder/folder.service'
import { NoteService } from 'src/note/note.service'

@Injectable()
export class UsersService {
	constructor(@InjectRepository(User) private usersRepository: Repository<User>,
		@InjectRepository(Note) private noteRepository: Repository<Note>, private noteService: NoteService,
		@InjectRepository(Folder) private folderRepository: Repository<Folder>, private folderService: FolderService) { }

	// USER
	async getUsers(): Promise<User[]> {
		const users = await this.usersRepository.find()
		return users
	}

	async getUserById(id: number): Promise<User> {
		const user = await this.usersRepository.findOne({where: {id}, relations: ["folders", "notes"]})
		return user
	}

	async createUser(dto: CreateUserDto): Promise<User> {
		const newUser = this.usersRepository.create(dto)
		return await this.usersRepository.save(newUser)
	}
	
	async deleteUser(id: number): Promise<void> {
		await this.usersRepository.delete(id)
	}

	// NOTES
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
		const note = await this.noteService.getUserNote(userId, noteId)
		if (!note) throw new Error(JSON.stringify({ error: "Note not found" }))
		if (updatedData.title) note.title = updatedData.title
		if (updatedData.content) note.content = updatedData.content
		return this.noteRepository.save(note)
	}

	async createNoteInFolder(userId: number, folderId: number, noteDto: CreateNoteDto): Promise<Note> {
		const newNote = await this.createNote(userId, noteDto)
		const folder = await this.folderRepository.findOne({ where: { id: folderId }, relations: ['notes'] })
		folder.notes.push(newNote)
		await this.folderRepository.save(folder)
		return newNote
	}

	// FOLDERS
	async createFolder(userId: number, folderDto: CreateFolderDto): Promise<Folder> {
		const user = await this.usersRepository.findOne({ where: { id: userId } })
		if (!user) throw new Error(JSON.stringify({ error: "User not found" }))
		const newFolder = this.folderRepository.create({
			user: user,
			name: folderDto.name
		})
		return await this.folderRepository.save(newFolder)
	}

	async renameFolder(userId: number, folderId: number, updatedData: Partial<Folder>): Promise<Folder> {
		const folder = await this.folderService.getUserFolder(userId, folderId)
		if (!folder) throw new Error(JSON.stringify({ error: "Folder not found" }))
		folder.name = updatedData.name
		return await this.folderRepository.save(folder)
	}

	async addNoteToFolder(userId: number, folderId: number, noteId: number): Promise<Folder> {
		const folder = await this.folderService.getUserFolder(userId, folderId)
		const note = await this.noteService.getUserNote(userId, noteId)
		folder.notes.push(note)
		return await this.folderRepository.save(folder)
	}
}

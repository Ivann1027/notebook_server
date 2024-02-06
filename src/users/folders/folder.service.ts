import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Folder } from './folder.entity'
import { Repository } from 'typeorm'
import { Note } from 'src/users/notes/note.entity'
import { User } from '../user.entity'
import { CreateFolderDto } from './folder-dto/create-folder.dto'
import { NoteService } from '../notes/note.service'

@Injectable()
export class FolderService {
	constructor(@InjectRepository(Folder) private folderRepository: Repository<Folder>,
		@InjectRepository(User) private usersRepository: Repository<User>, private noteService: NoteService
	) { }

	async getAllFolders(userId: number): Promise<Folder[]> {
		const folders = await this.folderRepository
			.createQueryBuilder('folder')
			.where('folder.user.id = :userId', { userId })
			.getMany()
		return folders
	}

	async getUserFolder(userId: number, folderId: number): Promise<Folder> {
		const folder = await this.folderRepository
			.createQueryBuilder('folder')
			.where('folder.user.id = :userId', { userId })
			.andWhere('folder.id = :folderId', { folderId })
			.leftJoinAndSelect('folder.notes', 'note')
			.getOne()
		if (!folder) throw new Error(JSON.stringify({error: 'Folder not found'}))
		return folder
	}

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
		const folder = await this.getUserFolder(userId, folderId)
		if (!folder) throw new Error(JSON.stringify({ error: "Folder not found" }))
		folder.name = updatedData.name
		return await this.folderRepository.save(folder)
	}

	async deleteFolder(userId: number, folderId: number): Promise<void> {
		const folderToRemove = await this.getUserFolder(userId, folderId)
		this.folderRepository.remove(folderToRemove)
	}

	async getAllFolderNotes(userId: number, folderId: number): Promise<Note[]> {
		const folder = await this.getUserFolder(userId, folderId)
		return folder.notes
	}

	async getFolderNote(userId: number, folderId: number, noteId: number): Promise<Note> {
		const folder = await this.getUserFolder(userId, folderId)
		const note = folder.notes.find(note => note.id == noteId)
		return note
	}

	async addNoteToFolder(userId: number, folderId: number, noteId: number): Promise<Folder> {
		const folder = await this.getUserFolder(userId, folderId)
		const note = await this.noteService.getUserNote(userId, noteId)
		folder.notes.push(note)
		return await this.folderRepository.save(folder)
	}

	async deleteNoteFromFolder(userId: number, folderId: number, noteId: number): Promise<Folder> {
		const folder = await this.getUserFolder(userId, folderId)
		const noteIndex = folder.notes.findIndex(note => note.id == noteId)
		folder.notes.splice(noteIndex, 1)
		return await this.folderRepository.save(folder)
	}
}

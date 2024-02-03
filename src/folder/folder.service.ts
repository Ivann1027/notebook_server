import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Folder } from './folder.entity'
import { Repository } from 'typeorm'
import { User } from 'src/users/user.entity'
import { CreateFolderDto } from './dto/create-folder.dto'
import { Note } from 'src/note/note.entity'
import { UsersService } from 'src/users/users.service'

@Injectable()
export class FolderService {
	constructor(@InjectRepository(Folder) private folderRepository: Repository<Folder>,
		private usersService: UsersService,
		@InjectRepository(Note) private notesRepository: Repository<Note>) { }
	
	async createFolder(dto: CreateFolderDto): Promise<Folder> {
		const { name, userId } = dto
		const user = await this.usersService.getUserById(userId)
		if (!user) {
			throw new Error(JSON.stringify({error: "User not found"}))
		}
		const folder = new Folder()
		folder.name = name
		folder.user = user
		return this.folderRepository.save(folder)
	}

	async getFolders(): Promise<Folder[]> {
		const folders = await this.folderRepository.find()
		return folders
	}

	async getFoldersByUser(userId: number): Promise<Folder[]> {
		const folders = await this.folderRepository
			.createQueryBuilder('folder')
			.where('folder.user.id = :userId', { userId })
			.getMany()
		return folders
	}

	async getFolderByUserIdAndFolderId(userId: number, folderId: number): Promise<Folder> {
		const folder = await this.folderRepository
			.createQueryBuilder('folder')
			.where('folder.user.id = :userId', { userId })
			.andWhere('folder.id = :folderId', { folderId })
			.leftJoinAndSelect('folder.notes', 'note')
			.getOne()
		return folder
	}

	async getUserNotesFromFolder(userId: number, folderId: number): Promise<Note[]> {
		const folder = await this.getFolderByUserIdAndFolderId(userId, folderId)
		return folder.notes
	}

	async getFolderById(id: number): Promise<Folder> {
		const folder = await this.folderRepository.findOne({ where: { id }, relations: ["notes"] })
		return folder
	}

	async addNoteToFolder(folderId: number, noteId: number): Promise<Folder> {
		const folder = await this.getFolderById(folderId)
		const note = await this.notesRepository.findOne({ where: { id: noteId } })
		if (!folder || !note) throw new Error(JSON.stringify({ error: "Folder or note not found" }))
		folder.notes.push(note)
		const updatedFolder = await this.folderRepository.save(folder)
		return updatedFolder
	}

	async deleteFolder(id: number): Promise<void> {
		await this.folderRepository.delete(id)
	}
}

import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Folder } from './folder.entity'
import { Repository } from 'typeorm'
import { Note } from 'src/note/note.entity'

@Injectable()
export class FolderService {
	constructor(@InjectRepository(Folder) private folderRepository: Repository<Folder>) { }

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

	async deleteFolder(folderId: number): Promise<void> {
		const folderToRemove = await this.folderRepository.findOne({ where: { id: folderId } })
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

	async deleteNoteFromFolder(userId: number, folderId: number, noteId: number): Promise<Folder> {
		const folder = await this.getUserFolder(userId, folderId)
		const noteIndex = folder.notes.findIndex(note => note.id == noteId)
		folder.notes.splice(noteIndex, 1)
		return await this.folderRepository.save(folder)
	}
}

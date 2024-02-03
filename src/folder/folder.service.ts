import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Folder } from './folder.entity'
import { Repository } from 'typeorm'

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

	async getFolder(userId: number, folderId: number): Promise<Folder> {
		const folder = await this.folderRepository
			.createQueryBuilder('folder')
			.where('folder.user.id = :userId', { userId })
			.andWhere('folder.id = :folderId', { folderId })
			.leftJoinAndSelect('folder.notes', 'note')
			.getOne()
		return folder
	}
}

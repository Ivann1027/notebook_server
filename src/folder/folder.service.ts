import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm';
import { Folder } from './folder.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/user.entity';
import { CreateFolderDto } from './dto/create-folder.dto';

@Injectable()
export class FolderService {
	constructor(@InjectRepository(Folder) private folderRepository: Repository<Folder>,
		@InjectRepository(User) private userRepository: Repository<User>) { }
	
	async createFolder(dto: CreateFolderDto): Promise<Folder> {
		const { name, userId } = dto
		const user = await this.userRepository.findOne({ where: { id: userId } })
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
}

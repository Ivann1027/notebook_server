import { Controller, Post, Get, Body } from '@nestjs/common'
import { FolderService } from './folder.service'
import { CreateFolderDto } from './dto/create-folder.dto'

@Controller('folders')
export class FolderController {
	constructor(private readonly folderService: FolderService) { }
	
	@Post()
	create(@Body() folderDto: CreateFolderDto) {
		return this.folderService.createFolder(folderDto)
	}

	@Get()
	getFolders() {
		return this.folderService.getFolders()
	}
}

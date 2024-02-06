import { Controller, Delete, Param } from '@nestjs/common'
import { FolderService } from './folder.service';

@Controller('folders')
export class FolderController {
	constructor(private folderService: FolderService) { }
	
	@Delete(':folderId')
	async deleteFolder(@Param('folderId') folderId: number): Promise<void> {
		return this.folderService.deleteFolder(folderId)
	}
}

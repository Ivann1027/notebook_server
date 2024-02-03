import { Module } from '@nestjs/common'
import { FolderController } from './folder.controller'
import { FolderService } from './folder.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Folder } from './folder.entity'
import { User } from 'src/users/user.entity'
import { Note } from 'src/note/note.entity'

@Module({
	imports: [TypeOrmModule.forFeature([Folder, User, Note])],
  controllers: [FolderController],
  providers: [FolderService]
})
export class FolderModule {}

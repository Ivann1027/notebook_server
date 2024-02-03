import { Module } from '@nestjs/common'
import { NoteController } from './note.controller'
import { NoteService } from './note.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from 'src/users/user.entity'
import { Note } from './note.entity'
import { Folder } from 'src/folder/folder.entity'

@Module({
	imports: [TypeOrmModule.forFeature([User, Note, Folder])],
  controllers: [NoteController],
  providers: [NoteService]
})
export class NoteModule {}

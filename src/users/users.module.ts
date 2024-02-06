import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Folder } from 'src/users/folders/folder.entity';
import { Note } from 'src/users/notes/note.entity';
import { FolderService } from 'src/users/folders/folder.service';
import { NoteService } from 'src/users/notes/note.service';
import { UsersNotesController } from './notes/users-notes.controller';
import { UsersFoldersController } from './folders/users-folders.controller';

@Module({
	imports: [TypeOrmModule.forFeature([User, Folder, Note])],
  controllers: [UsersController, UsersNotesController, UsersFoldersController],
  providers: [UsersService, FolderService, NoteService]
})
export class UsersModule {}

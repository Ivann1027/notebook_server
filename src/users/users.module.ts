import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Folder } from 'src/folder/folder.entity';
import { Note } from 'src/note/note.entity';

@Module({
	imports: [TypeOrmModule.forFeature([User, Folder, Note])],
  controllers: [UsersController],
  providers: [UsersService]
})
export class UsersModule {}

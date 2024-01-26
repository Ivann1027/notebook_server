import { Folder } from "src/folder/folder.entity"
import { Note } from "src/note/note.entity"
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm"

@Entity('users')
export class User {
	@PrimaryGeneratedColumn()
	id: number

	@Column()
	name: string

	@Column({unique: true})
	email: string

	@Column()
	password: string

	@OneToMany(() => Folder, folder => folder.user, {nullable: true})
	folders: Folder[]

	@OneToMany(() => Note, note => note.user, {nullable: true})
	notes: Note[]
}
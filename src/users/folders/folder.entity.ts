import { Note } from "src/users/notes/note.entity"
import { User } from "src/users/user.entity"
import { Entity, ManyToOne, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from "typeorm"

@Entity('folders')
export class Folder {
	@PrimaryGeneratedColumn()
	id: number

	@Column()
	name: string

	@ManyToOne(() => User, user => user.folders)
	user: User

	@ManyToMany(() => Note, { nullable: true })
	@JoinTable({name: 'folder-note'})
	notes: Note[]
}
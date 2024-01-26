import { Folder } from "src/folder/folder.entity"
import { User } from "src/users/user.entity"
import { Column, PrimaryGeneratedColumn, Entity, ManyToMany, JoinTable, ManyToOne } from "typeorm"


@Entity('notes')
export class Note {
	@PrimaryGeneratedColumn()
	id: number

	@Column()
	title: string

	@Column()
	content: string

	@ManyToOne(() => User, user => user.notes)
	user: User

	@ManyToMany(() => Folder, folder => folder.notes, { nullable: true })
	@JoinTable({name: 'folder-note'})
	folders: Folder[]
}
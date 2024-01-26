import { Module } from '@nestjs/common'
import { UsersModule } from './users/users.module'
import { TypeOrmModule } from '@nestjs/typeorm'

@Module({
	imports: [
		UsersModule,
		TypeOrmModule.forRoot({
			type: 'mysql',
			host: '127.0.0.1',
			port: 3306,
			username: 'root',
			password: '',
			database: 'notebook',
			autoLoadEntities: true,
			synchronize: true
		})
	],
  controllers: [],
  providers: [],
})
export class AppModule {}

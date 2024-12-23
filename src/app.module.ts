import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { DATABASE } from './common/config';

console.log(DATABASE);


@Module({
  imports: [
    MongooseModule.forRoot(DATABASE.URI, { dbName: DATABASE.DB_NAME }),
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

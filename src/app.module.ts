import { Module } from '@nestjs/common';
import { AppController } from './app.controller';

import { LightData } from './serial/serial.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppService } from './app.service';
import { SerialModule } from './serial/serial.module';



@Module({
  imports: [SerialModule, TypeOrmModule.forRoot({
    type: 'sqlite',
    database: 'db.sqlite',
    entities: [],
    synchronize: true
  }),
  TypeOrmModule.forFeature([LightData])
],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
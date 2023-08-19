import { Module } from '@nestjs/common';
import { SerialService } from './serial.service';

import { LightData } from './serial.entity';
import { SerialController } from './serial.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([LightData])],
  providers: [SerialService],
  controllers: [SerialController]
})
export class SerialModule {}

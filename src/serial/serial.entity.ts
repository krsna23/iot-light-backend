// light-data.model.ts
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class LightData {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  timestamp: String;

  @Column()
  sensorId: string;

  @Column()
  status: string;
}
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('light_data')
export class LightDataEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  brightness: number;

  @Column()
  color: string;

  // Other properties...

  // You can also define relationships here if needed

  // Constructors, methods, etc.
}
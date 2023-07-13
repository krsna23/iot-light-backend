import { Injectable } from '@nestjs/common';
import { SerialPort } from 'serialport';


import { Repository } from 'typeorm';
import { LightData } from './serial.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class SerialService {
    private serialPort: SerialPort;

  
    constructor( 
        @InjectRepository(LightData)
        private readonly repo: Repository<LightData>
        ) {
        // Create a new SerialPort instance with the appropriate port name and baud rate
        this.serialPort = new SerialPort('/dev/ttyACM0', { baudRate: 9600 });
        this.setupSerialCommunication();
    }

    setupSerialCommunication(): void{
        this.serialPort.on('data', (data: Buffer)=>{
            const message = data.toString();
            const [sensorId, status] = message.split(',');

            const lightData = new LightData();
            lightData.timestamp = new Date();
            lightData.sensorId = sensorId;
            lightData.status = status;

            console.log("light data from service setup:", lightData);

            this.repo.save(lightData);
        })
    }

    getData(){
        
    }

  writeData(data: string): void {
    // Write data to the serial port
    this.serialPort.write(data);
  }

//   readData(): Observable<string> {
//     return new Observable((observer: Observer<string>) => {
//       this.serialPort.on('data', (data: Buffer) => {
//         observer.next(data.toString());
//       });

      // Handle errors
//       this.serialPort.on('error', (error: Error) => {
//         reject(error);
//       });
//     });
//   }
}
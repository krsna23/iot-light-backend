import { Injectable } from '@nestjs/common';
import { SerialPort } from 'serialport';


import { Repository } from 'typeorm';
import { LightData } from './serial.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Observable, Observer } from 'rxjs';

@Injectable()
export class SerialService {
    private serialPort: SerialPort;

    constructor(
      @InjectRepository(LightData)
      private readonly repo: Repository<LightData>
    ) {
      // Update the portPath based on your Arduino's configuration
      const serialPortPath = "COM4"; // Replace with the actual path of your serial port
      this.serialPort = new SerialPort({ path: serialPortPath, baudRate: 9600 },(error) => {
        if (error) {
          console.error("Error opening serial port:", error);
        } else {
          console.log("Serial port opened successfully.");
        }})

        this.setupSerialCommunication();
    }

    setupSerialCommunication(): void{
      console.log("Setting up serial communication...");
      console.log("Serial port object:", this.serialPort);
  
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
        return this.repo.find();
    }

  writeData(data: string): void {
    // Write data to the serial port
    this.serialPort.write(data);
  }

  readData(): Observable<string> {
    return new Observable((observer: Observer<string>) => {
      this.serialPort.on('data', (data: Buffer) => {
        observer.next(data.toString());
      });
  
      this.serialPort.on('close', () => {
        observer.complete(); 
        // Complete the observer when the port is closed
      });

      // Handle errors
      this.serialPort.on('error', (error: Error) => {
        observer.error(error); // Use observer.error to emit the error
      });
    });
  }

}

function reject(error: Error) {
    throw new Error('Function not implemented.');
}

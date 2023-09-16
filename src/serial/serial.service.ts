import { Injectable } from '@nestjs/common';
import { SerialPort } from 'serialport';


import { Repository } from 'typeorm';
import { LightData } from './serial.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Observable, Observer } from 'rxjs';

import * as moment from 'moment-timezone';

interface iotData {
  id: number;
  timestamp: string;
  sensorId: string;
  status: string;
}


@Injectable()
export class SerialService {
  private serialPort: SerialPort;

  constructor(
    @InjectRepository(LightData) // Use LightData, not serial.entity
    private readonly repo: Repository<LightData>
  ){

    // Clear the existing data from the table
    //Commented out for testiing:
    // this.repo.clear();

    // Update the portPath based on your Arduino's configuration
    const serialPortPath = "COM8"; // Replace with the actual path of your serial port
    this.serialPort = new SerialPort({ path: serialPortPath, baudRate: 9600 },(error) => {
      if (error) {
        console.error("Error opening serial port:", error);
      } else {
        console.log("Serial port opened successfully.");
        console.log("Time:", new Date());
      }})
      this.setupSerialCommunication();
    }

  setupSerialCommunication(): void{
    console.log("Setting up serial communication...");
    console.log("Serial port object:", this.serialPort);
    // console.log("Time:", new Date());
    this.serialPort.on('data', (data: Buffer)=>{
      const message = data.toString();
      console.log("Message of IoT:",message);
      const [sensorId, status] = message.split(',');
      // Create a new moment object in the India Standard Time (IST) zone
      const timeZone = 'Asia/Kolkata';
      const nowInIST = moment.tz(timeZone);

      // Get the current time in the IST zone
      const currentTimeInIST = nowInIST.format('YYYY-MM-DD HH:mm:ss');

      // console.log(`Current time in India Standard Time (IST): ${currentTimeInIST}`);

      const lightData = new LightData();
      lightData.timestamp = currentTimeInIST;
      lightData.sensorId = sensorId;
      lightData.status = status;
      console.log("light data from service setup:", lightData);

      // if (status == '0\r\n'){
      //   console.log("SAVE")
      //   lightData.status = status.trim();
      //   this.repo.save(lightData);
      // }
      if (status == '0\r\n' || status == '1\r\n'){
        // console.log("SAVE")
        lightData.status = status.trim();
        this.repo.save(lightData);
      }
    
    })
  }
    
  getMotion(){
    return this.repo.find();
  }

  getData(){
      return this.repo.find();
  }

  writeData(data: iotData): void {
    // Write data to the table

    console.log("Data to be written");
    this.repo.save(data);
    
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

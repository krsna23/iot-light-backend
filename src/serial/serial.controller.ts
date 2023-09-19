import { Controller, Post, Body, Get } from '@nestjs/common';
import { SerialService } from './serial.service';
import { IOType } from 'child_process';

interface iotData {
    id: number;
    timestamp: string;
    sensorId: string;
    status: string;
  }
  

@Controller()
export class SerialController {
    constructor(private serialService: SerialService){}

    // @Post('send-data')
    // sendData(@Body() data: string): string{
    //     this.serialService.writeData(data);
    //     return 'Data sent to arduino';
    // }

    @Get('/all')
    getData():any {
        console.log("Request received for all data.")
        return this.serialService.getData();
    }

    @Get('/motion')
    getMotion():any {
        console.log("Request received for motion data.")

        return this.serialService.getMotion();
    }

    @Post('/write')
    sendData(@Body() data: iotData): string{
        this.serialService.writeData(data);
        return 'Data sent to arduino';
    }
}

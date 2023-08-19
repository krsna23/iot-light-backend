import { Controller, Post, Body, Get } from '@nestjs/common';
import { SerialService } from './serial.service';



@Controller('arduino')
export class SerialController {
    constructor(private serialService: SerialService){}

    @Post('send-data')
    sendData(@Body() data: string): string{
        this.serialService.writeData(data);
        return 'Data sent to arduino';
    }

    @Get()
    getData():any {
        return this.serialService.getData();
    }
}

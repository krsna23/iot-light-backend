import { Controller, Post, Body } from '@nestjs/common';
import { SerialService } from './serial.service';


@Controller('arduino')
export class SerialController {
    constructor(private readonly serialService: SerialService){}

    @Post('send-data')
    sendData(@Body() data: string): string{
        this.serialService.writeData(data);
        return 'Data sent to arduino';
    }
}

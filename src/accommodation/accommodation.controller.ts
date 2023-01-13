import { Controller, Post, Get } from '@nestjs/common';
import { Body } from '@nestjs/common/decorators';
import { AccommodationService } from './accommodation.service';

@Controller('accommodation')
export class AccommodationController {
    constructor(private accommodationService: AccommodationService) {}
    @Post('add')
    add(@Body() dto: any) {
        return this.accommodationService.add(dto)
    }

    @Get('search') 
    search(@Body() dto: any) {
        return this.accommodationService.search(dto)
    }
}

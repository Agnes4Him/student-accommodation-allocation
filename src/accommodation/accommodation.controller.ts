import { Controller, Post, Get, HttpStatus } from '@nestjs/common';
import { Body, HttpCode } from '@nestjs/common/decorators';
import { AccommodationService } from './accommodation.service';

@Controller('accommodation')
export class AccommodationController {
    constructor(private accommodationService: AccommodationService) {}
    @HttpCode(HttpStatus.OK)
    @Post('add')
    add(@Body() dto: any) {
        return this.accommodationService.add(dto)
    }

    @HttpCode(HttpStatus.OK)
    @Get('search') 
    search(@Body() dto: any) {
        return this.accommodationService.search(dto)
    }
}

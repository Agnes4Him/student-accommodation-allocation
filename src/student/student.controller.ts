import { Controller, Post, Put, Get, Delete, HttpStatus } from '@nestjs/common';
import { Body, HttpCode } from '@nestjs/common/decorators';
import { StudentService } from './student.service';

@Controller('student')
export class StudentController {
    constructor(private studentService: StudentService) {}
    @HttpCode(HttpStatus.OK)
    @Post('register')
    register(@Body() dto: any) {
        return this.studentService.register(dto)
    }

    @HttpCode(HttpStatus.OK)
    @Put('update')
    update(@Body() dto: any) {
        return this.studentService.update(dto)
    }

    @HttpCode(HttpStatus.OK)
    @Delete('remove')
    remove(@Body() dto: any) {
        return this.studentService.remove(dto)
    }

    @HttpCode(HttpStatus.OK)
    @Get('list')
    list() {
        return this.studentService.list()
    }
}

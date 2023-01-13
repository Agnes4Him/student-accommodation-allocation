import { Controller, Post, Put, Get, Delete } from '@nestjs/common';
import { Body } from '@nestjs/common/decorators';
import { StudentService } from './student.service';

@Controller('student')
export class StudentController {
    constructor(private studentService: StudentService) {}

    @Post('register')
    register(@Body() dto: any) {
        return this.studentService.register(dto)
    }

    @Put('update')
    update() {
        return this.studentService.update()
    }

    @Delete('remove')
    remove() {
        return this.studentService.remove()
    }

    @Get('list')
    list() {
        return this.studentService.list()
    }
}

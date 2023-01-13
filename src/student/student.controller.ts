import { Controller, Post, Put, Get, Delete } from '@nestjs/common';
import { StudentService } from './student.service';

@Controller('student')
export class StudentController {
    constructor(private studentService: StudentService) {}

    @Post('register')
    register() {
        return this.studentService.register()
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

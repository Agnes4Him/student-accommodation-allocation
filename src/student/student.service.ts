import { Injectable } from '@nestjs/common';

@Injectable()
export class StudentService {
    register() {
        return {msg: 'I am registered'}
    }

    update() {
        return {msg: 'I am being updated'}
    }

    remove() {
        return {msg: 'I have been deleted'}
    }

    list() {
        return {msg: 'A list of registered students and their accommodation'}
    }
}

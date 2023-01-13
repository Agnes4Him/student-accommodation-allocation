import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as argon from 'argon2'

@Injectable()
export class StudentService {
    constructor(private prisma: PrismaService) {}
    async register(dto) {
        var studentRoom
        if (!dto.fullName || !dto.password || !dto.age || !dto.department || !dto.hostelName) {
            return {msg: "Enter details correctly"}
        }else{
            const hashedPassword = await argon.hash(dto.password)
            const hostel = await this.prisma.hostels.findFirst({
                where: {
                    name: dto.hostelName
                }
            })
            if (hostel && hostel.status === "available") {
                const rooms = await this.prisma.rooms.findMany({
                    where: {
                        hostelName: dto.hostelName
                    }
                })
                if (rooms) {
                    for (let i = 0; i < rooms.length; i++) {
                        if (rooms[i].numberOfBeds > 0) {
                            studentRoom = rooms[i]
                            break
                        }
                    }
                    const student = await this.prisma.students.create({
                        data: {
                            fullName: dto.fullName,
                            password: hashedPassword,
                            age: dto.age,
                            department: dto.department,
                            hostelName: dto.hostelName,
                            room: studentRoom,
                        }
                    })
                }
            }
        }
        return {msg: "Registration is successful and accommdation assigned", room: studentRoom, hostel: dto.hostelName}
    }

    update(dto) {
        return {msg: 'Student accommodation will be updated here'}    
    }

    remove(dto) {
        return {msg: 'Student accommodation will be deleted here'}
    }

    async list() {
        var studentsArray

        const allStudents = await this.prisma.students.findMany({})
        if (allStudents) {
            for (let i = 0; i < allStudents.length; i++) {
                var studentObj = {
                    name: allStudents[i].fullName,
                    hostel: allStudents[i].hostelName
                }
                studentsArray.push(studentObj)
            }
        }
        return {msg: studentsArray}
    }
}

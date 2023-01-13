import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as argon from 'argon2'

@Injectable()
export class StudentService {
    constructor(private prisma: PrismaService) {}
    async register(dto) {

        var studentRoom
        var oldBedCount
        var newBedCount
        var roomId

        if (!dto.fullName || !dto.password || !dto.age || !dto.department || !dto.hostelName) {
            return {msg: "Enter your details correctly"}
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
            const getAssignedRoom = await this.prisma.rooms.findFirst({
                where: {
                    roomLabel: studentRoom,
                    hostelName: dto.hostelName
                }
            })

            oldBedCount = getAssignedRoom.numberOfBeds
            newBedCount = oldBedCount - 1
            roomId = getAssignedRoom.id

            const updateAssignedRoom = await this.prisma.rooms.update({
                where: {
                    id: roomId,
                },
                data: {
                    numberOfBeds: newBedCount
                }
            })

            return {msg: "Registration is successful and accommdation assigned", room: studentRoom, hostel: dto.hostelName}
        }
    }

    update(dto) {
        return {msg: 'Student accommodation will be updated here'}    
    }

    async remove(dto) {

        const student = await this.prisma.students.findFirst({
            where: {
                fullName: dto.fullName,
                age: dto.age,
                department:dto.department
            }
        })

        if (student) {
            const deletedStudent = await this.prisma.students.delete({
                where: {
                    id: student.id,
                },
            })

            if (deletedStudent) {
                let oldBedCount
                let newBedCount
                const getStudentRoom = await this.prisma.rooms.findFirst({
                    where: {
                        roomLabel: student.room
                    }
                })
                oldBedCount = getStudentRoom.numberOfBeds
                newBedCount = oldBedCount + 1
                const updateRoomData = await this.prisma.rooms.update({
                    where: {
                        id:getStudentRoom.id
                    },
                    data: {
                        numberOfBeds: newBedCount
                    }
                })
                return {msg: 'Student accommodation successfully deleted'}
            }
        }
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

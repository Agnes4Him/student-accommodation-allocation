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
                            studentRoom = rooms[i].roomLabel
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

            // Update every hostel's status (available or taken)
            const allHostels = await this.prisma.hostels.findMany({})
            for (let h = 0; h < allHostels.length; h++) {
                const eachHostelName = allHostels[h].name
                const eachHostelStatus = allHostels[h].status
                const eachHostelId = allHostels[h].id
                var totalBedCount = 0

                const rooms = await this.prisma.rooms.findMany({})
                for (let r = 0; r < rooms.length; r++) {
                    if (eachHostelName === rooms[r].hostelName) {
                        totalBedCount = totalBedCount + rooms[r].numberOfBeds
                    }
                }
                if (totalBedCount === 0) {
                    const updateHostelStatus = await this.prisma.hostels.update({
                        where: {
                            id: eachHostelId
                        },
                        data: {
                            status: "taken"
                        }
                    })
                }
            }

            return {msg: "Registration is successful and accommdation assigned", room: studentRoom, hostel: dto.hostelName}
        }
    }

    async update(dto) { 
        var assignableRoom
        var oldRoom
        var oldHostelName
        var oldRoomId
        var oldRoomOldBedCount
        var oldRoomNewBedCont
        var newRoomId
        var newRoomOldBedCount
        var newRoomNewBedCont

        const student = await this.prisma.students.findFirst({
            where: {
                fullName: dto.fullName,
                age: dto.age,
                department: dto.department
            }
        }) 
        if (student) {
            oldRoom = student.room
            oldHostelName = student.hostelName
            const availableRooms = await this.prisma.rooms.findMany({
                where: {
                    hostelName: dto.hostelName
                }
            })
            if (availableRooms) {
                for (let i = 0; i < availableRooms.length; i++) {
                    if (availableRooms[i].numberOfBeds > 0) {
                    assignableRoom = availableRooms[i]
                    break
                    }
                }
                const updateStudentAccommodation = await this.prisma.students.update({
                    where: {
                        id: student.id
                    },
                    data: {
                        room: assignableRoom,
                        hostelName: dto.hostelName
                    }
                })
                // Update old room data here
                const getOldRoom = await this.prisma.rooms.findFirst({
                    where: {
                        roomLabel: oldRoom,
                        hostelName: oldHostelName
                    }
                })
                if (getOldRoom) {
                    oldRoomId = getOldRoom.id
                    oldRoomOldBedCount = getOldRoom.numberOfBeds
                    oldRoomNewBedCont = oldRoomOldBedCount + 1
                    const updateOldRoomData = await this.prisma.rooms.update({
                        where: {
                            id: oldRoomId
                        },
                        data: {
                            numberOfBeds: oldRoomNewBedCont
                        }
                    })
                }

                // Update newly assigned room data here
                const getNewRoom = await this.prisma.rooms.findFirst({
                    where: {
                        roomLabel: assignableRoom,
                        hostelName: dto.HostelName
                    }
                })
                if (getNewRoom) {
                    newRoomId = getNewRoom.id
                    newRoomOldBedCount = getNewRoom.numberOfBeds
                    newRoomNewBedCont = newRoomOldBedCount + 1
                    const updateNewRoomData = await this.prisma.rooms.update({
                        where: {
                            id: newRoomId
                        },
                        data: {
                            numberOfBeds: newRoomNewBedCont
                        }
                    })
                }

                // Update hostels status (available or taken here)

                return {msg: "Change successfully made", room: assignableRoom, hostel: dto.hostelName}

            }
        } 
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

                // Update hostels status here (available or taken)
                
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

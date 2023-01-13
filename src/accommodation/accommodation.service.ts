import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AccommodationService {
    constructor(private prisma: PrismaService) {}

    async add(dto) {
        if (!dto.roomLabel || !dto.hostelName || !dto.numberOfBeds) {
            return {msg: 'Details incomplee'}
        }else {
            const findRoom = await this.prisma.rooms.findFirst({
                where: {
                    roomLabel: dto.roomLabel,
                    hostelName: dto.hostelName
                }
            })
            if (findRoom) {
                return {msg: 'That room details already exist'}
            }else {
                const room = await this.prisma.rooms.create({
                    data: {
                        roomLabel: dto.roomLabel,
                        hostelName: dto.hostelName,
                        numberOfBeds: dto.numberOfBeds
                    }
                })
                if (room) {
                    const findHostel = this.prisma.hostels.findFirst({
                        where: {
                            name: dto.hostelName,
                        }
                    })
                    if (!findHostel) {
                        const hostel = this.prisma.hostels.create({
                            data: {
                                name: dto.hostelName,
                                status: "available"
                            }
                        })
                    }

                }
                return {msg: "Accommodation successfully added"}
            }
        }
    }

    search(dto) {
        return {msg: 'Searching for accommodation'}
    }
}

import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AccommodationService {
    constructor(private prisma: PrismaService) {}

    async add(dto) {
        if (!dto.roomLabel || !dto.hostelName || !dto.numberOfBeds) {
            return {msg: 'Details incomplete'}
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
                const findHostel = await this.prisma.hostels.findFirst({
                    where: {
                        name: dto.hostelName,
                    }
                })
                if (!findHostel) {
                    const hostel = await this.prisma.hostels.create({
                        data: {
                            name: dto.hostelName,
                            status: "available"
                        }
                    })
                }
                return {msg: "Accommodation successfully added"}            
            }
        }
    }

    async search(dto) {
        const hostels = await this.prisma.hostels.findMany({
            where: {
                status: dto.filter
            }
        })

        if (hostels) {
            return {msg: hostels}
        }else {
            return {msg : "Sorry, no search results to display"}
        }
    }
}

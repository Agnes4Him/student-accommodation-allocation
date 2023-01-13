import { Module } from '@nestjs/common';
import { StudentModule } from './student/student.module';
import { AccommodationModule } from './accommodation/accommodation.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [StudentModule, AccommodationModule, PrismaModule, ConfigModule.forRoot({isGlobal:true,})],
})
export class AppModule {}

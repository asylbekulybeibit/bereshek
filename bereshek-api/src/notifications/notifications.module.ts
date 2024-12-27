import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { NotificationsService } from './notifications.service';
import { WhatsappService } from './whatsapp.service';
import { DebtsModule } from '../debts/debts.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    DebtsModule,
    UsersModule,
  ],
  providers: [NotificationsService, WhatsappService],
  exports: [NotificationsService],
})
export class NotificationsModule {} 
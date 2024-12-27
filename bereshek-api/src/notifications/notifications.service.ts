import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { WhatsappService } from './whatsapp.service';
import { DebtsService } from '../debts/debts.service';
import { UsersService } from '../users/users.service';
import { DebtStatus } from '../debts/entities/debt.entity';

@Injectable()
export class NotificationsService {
  constructor(
    private whatsappService: WhatsappService,
    private debtsService: DebtsService,
    private usersService: UsersService,
  ) {}

  // Проверка долгов каждый день в 10:00
  @Cron(CronExpression.EVERY_DAY_AT_10AM)
  async handleDailyNotifications() {
    await this.checkUpcomingDebts();
    await this.checkOverdueDebts();
  }

  private async checkUpcomingDebts() {
    const users = await this.getAllUsersWithDebts();

    for (const user of users) {
      const upcomingDebts = await this.debtsService.findUpcoming(user.id);

      for (const debt of upcomingDebts) {
        const daysUntilDue = this.getDaysUntilDue(debt.dueDate);

        // Отправляем уведомления за 7, 3 и 1 день до срока
        if ([7, 3, 1].includes(daysUntilDue) && !debt.notificationSent) {
          try {
            await this.whatsappService.sendDebtReminder(
              debt.debtor.whatsapp,
              `${debt.debtor.firstName} ${debt.debtor.lastName}`,
              debt.amount,
              debt.dueDate,
            );

            // Обновляем статус уведомления
            await this.debtsService.update(debt.id, { notificationSent: true }, user.id);
          } catch (error) {
            console.error(`Failed to send reminder for debt ${debt.id}:`, error);
          }
        }
      }
    }
  }

  private async checkOverdueDebts() {
    const users = await this.getAllUsersWithDebts();

    for (const user of users) {
      const overdueDebts = await this.debtsService.findOverdue(user.id);

      for (const debt of overdueDebts) {
        if (debt.status === DebtStatus.ACTIVE) {
          try {
            await this.whatsappService.sendOverdueNotification(
              debt.debtor.whatsapp,
              `${debt.debtor.firstName} ${debt.debtor.lastName}`,
              debt.amount,
              debt.dueDate,
            );

            // Обновляем статус долга на просроченный
            await this.debtsService.update(debt.id, { status: DebtStatus.OVERDUE }, user.id);
          } catch (error) {
            console.error(`Failed to send overdue notification for debt ${debt.id}:`, error);
          }
        }
      }
    }
  }

  private getDaysUntilDue(dueDate: Date): number {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  private async getAllUsersWithDebts(): Promise<any[]> {
    return await this.usersService.findUsersWithActiveDebts();
  }
} 
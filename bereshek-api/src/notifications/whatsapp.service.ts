import { Injectable, OnModuleInit } from '@nestjs/common';
import { Client } from 'whatsapp-web.js';
import * as qrcode from 'qrcode-terminal';

@Injectable()
export class WhatsappService implements OnModuleInit {
  private client: Client;
  private isReady = false;

  constructor() {
    this.client = new Client({
      puppeteer: {
        args: ['--no-sandbox'],
      }
    });

    this.client.on('qr', (qr) => {
      qrcode.generate(qr, { small: true });
    });

    this.client.on('ready', () => {
      console.log('WhatsApp client is ready!');
      this.isReady = true;
    });
  }

  async onModuleInit() {
    await this.client.initialize();
  }

  async sendMessage(to: string, message: string): Promise<void> {
    if (!this.isReady) {
      throw new Error('WhatsApp client is not ready');
    }

    // Форматируем номер телефона
    const formattedNumber = to.replace(/\D/g, '');
    const chatId = `${formattedNumber}@c.us`;

    try {
      await this.client.sendMessage(chatId, message);
    } catch (error) {
      console.error('Error sending WhatsApp message:', error);
      throw new Error('Failed to send WhatsApp message');
    }
  }

  async sendDebtReminder(to: string, debtorName: string, amount: number, dueDate: Date): Promise<void> {
    const message = `Здравствуйте! Напоминаем о необходимости погасить долг:\n\n` +
      `Сумма: ${amount} руб.\n` +
      `Срок погашения: ${dueDate.toLocaleDateString()}\n\n` +
      `Пожалуйста, не забудьте произвести оплату вовремя.`;

    await this.sendMessage(to, message);
  }

  async sendOverdueNotification(to: string, debtorName: string, amount: number, dueDate: Date): Promise<void> {
    const message = `ВНИМАНИЕ! У вас есть просроченный долг:\n\n` +
      `Сумма: ${amount} руб.\n` +
      `Срок погашения: ${dueDate.toLocaleDateString()}\n\n` +
      `Пожалуйста, погасите задолженность как можно скорее.`;

    await this.sendMessage(to, message);
  }
} 
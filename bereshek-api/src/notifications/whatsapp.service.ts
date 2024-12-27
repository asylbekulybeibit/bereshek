import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client, LocalAuth } from 'whatsapp-web.js';
import * as qrcode from 'qrcode-terminal';

@Injectable()
export class WhatsappService implements OnModuleInit, OnModuleDestroy {
  private client: Client;
  private isReady = false;

  constructor(private configService: ConfigService) {
    this.client = new Client({
      authStrategy: new LocalAuth({
        clientId: 'owner',
      }),
      puppeteer: {
        args: ['--no-sandbox'],
      },
    });

    this.client.on('qr', (qr) => {
      console.log('QR Code received. Scan it with your WhatsApp app:');
      qrcode.generate(qr, { small: true });
    });

    this.client.on('ready', () => {
      console.log('WhatsApp client is ready!');
      this.isReady = true;
    });

    this.client.on('authenticated', () => {
      console.log('WhatsApp client is authenticated!');
    });

    this.client.on('auth_failure', (msg) => {
      console.error('WhatsApp authentication failed:', msg);
    });
  }

  async onModuleInit() {
    await this.initializeClient();
  }

  async onModuleDestroy() {
    if (this.client) {
      await this.client.destroy();
    }
  }

  private async initializeClient() {
    try {
      await this.client.initialize();
    } catch (error) {
      console.error('Failed to initialize WhatsApp client:', error);
      throw error;
    }
  }

  private async ensureReady(): Promise<void> {
    if (!this.isReady) {
      await new Promise<void>((resolve) => {
        const checkReady = () => {
          if (this.isReady) {
            resolve();
          } else {
            setTimeout(checkReady, 1000);
          }
        };
        checkReady();
      });
    }
  }

  async sendDebtReminder(
    phone: string,
    debtorName: string,
    amount: number,
    dueDate: Date,
  ): Promise<void> {
    await this.ensureReady();

    const formattedPhone = this.formatPhoneNumber(phone);
    const formattedAmount = amount.toLocaleString('ru-RU', {
      style: 'currency',
      currency: 'RUB',
    });
    const formattedDate = dueDate.toLocaleDateString('ru-RU');

    const message =
      `Здравствуйте, ${debtorName}!\n\n` +
      `Напоминаем о необходимости погасить долг в размере ${formattedAmount} до ${formattedDate}.\n\n` +
      'Пожалуйста, не игнорируйте это сообщение.';

    try {
      await this.client.sendMessage(`${formattedPhone}@c.us`, message);
    } catch (error) {
      console.error(`Failed to send WhatsApp message to ${phone}:`, error);
      throw error;
    }
  }

  async sendOverdueNotification(
    phone: string,
    debtorName: string,
    amount: number,
    dueDate: Date,
  ): Promise<void> {
    await this.ensureReady();

    const formattedPhone = this.formatPhoneNumber(phone);
    const formattedAmount = amount.toLocaleString('ru-RU', {
      style: 'currency',
      currency: 'RUB',
    });
    const formattedDate = dueDate.toLocaleDateString('ru-RU');

    const message =
      `Здравствуйте, ${debtorName}!\n\n` +
      `Срок погашения долга в размере ${formattedAmount} истек ${formattedDate}.\n` +
      'Пожалуйста, погасите задолженность в ближайшее время.\n\n' +
      'В случае игнорирования этого сообщения мы будем вынуждены принять соответствующие меры.';

    try {
      await this.client.sendMessage(`${formattedPhone}@c.us`, message);
    } catch (error) {
      console.error(`Failed to send WhatsApp message to ${phone}:`, error);
      throw error;
    }
  }

  private formatPhoneNumber(phone: string): string {
    // Удаляем все нецифровые символы
    return phone.replace(/\D/g, '');
  }
}

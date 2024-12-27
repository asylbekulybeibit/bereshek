import { registerAs } from '@nestjs/config';

export default registerAs('whatsapp', () => ({
  sessionPath: process.env.WHATSAPP_SESSION_PATH || './whatsapp-session',
})); 
// backend/src/contact/contact.service.ts
import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ContactService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService, 
  ) {}

  async sendContactEmail(contactDto: { name: string; email: string; message: string }) {
    await this.mailerService.sendMail({
      to: this.configService.get<string>('RECEIVER_EMAIL'), 
      subject: `New Portfolio Message from ${contactDto.name}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #0284c7;">New Contact Request</h2>
          <p><strong>Name:</strong> ${contactDto.name}</p>
          <p><strong>Email:</strong> ${contactDto.email}</p>
          <hr style="border: 0; border-top: 1px solid #eee;" />
          <p><strong>Message:</strong></p>
          <p style="background: #f9fafb; padding: 15px; border-radius: 8px;">${contactDto.message}</p>
        </div>
      `,
    });
    return { success: true, message: 'Email sent successfully' };
  }
}
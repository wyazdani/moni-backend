import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { OpenAI } from 'openai';
import { Message } from './schemas/message.schema';
import { UsersService } from 'src/users/users.service';
import { ConfigService } from '@nestjs/config';
import { AuthenticatedSocket } from './messages.gateway';
import { Role } from './enums/role.enum';

@Injectable()
export class MessagesService {
  client: OpenAI;
  constructor(
    @InjectModel(Message.name) private messageModel: Model<Message>,
    private usersService: UsersService,
    private configService: ConfigService,
  ) {
    this.client = new OpenAI({
      apiKey: this.configService.get<string>('GPT_API_KEY'),
    });
  }

  async getMessages(userId: string) {
    const messages = await this.messageModel
      .find({ 'user._id': userId })
      .sort({ createdAt: -1 })
      .lean();

    return messages.map((m) => ({
      ...m,
      user: {
        _id: m.role == 'user' ? m.user._id : m.role,
      },
    }));
  }

  async getHistory(userId: string) {
    const history = await this.messageModel
      .find({ 'user._id': userId })
      .sort({ createdAt: 1 })
      .limit(10)
      .lean();

    // Convert to OpenAI message format
    return history.map((m) => ({
      role: m.role,
      content: m.text,
    }));
  }

  async saveMessage(userId: string, text: string, role: Role) {
    const msg = {
      text,
      user: { _id: userId },
      role,
    };
    await this.messageModel.create(msg);
    return msg;
  }

  async getFinancialSummary(userId: string) {
    const user = await this.usersService.findById(userId);
    // console.log({ user });
    const { income = 0, expense = 0 } = user || {};
    return (
      user &&
      `
            User Financial Summary:
            Total Income: ${income}
            Total Expense: ${expense}
            Remaining Balance: ${income - expense}
          `
    );
  }

  async streamResponse(
    userId: string,
    userMessage: string,
    client: AuthenticatedSocket,
  ) {
    const history = await this.getHistory(userId);
    // console.log('History:', history);
    const financialContext = await this.getFinancialSummary(userId);
    // console.log('Financial Context:', financialContext);
    // console.log('User Message:', userMessage);

    // Save the user message (GiftedChat format)
    await this.saveMessage(userId, userMessage, Role.User);

    const stream = await this.client.chat.completions.create({
      model: 'gpt-4o-mini',
      stream: true,
      messages: [
        {
          role: 'system',
          content: `
                    You are a budgeting assistant.
                    Always base your answers on user's actual data.
                    If data is missing, ask clear follow-up questions.
                    Ask only one question at a time.

                    ${financialContext}
                  `,
        },
        ...history,
        { role: 'user', content: userMessage },
      ],
    });

    let fullResponse = '';
    for await (const event of stream) {
      const token = event.choices?.[0]?.delta?.content || '';
      if (token) {
        fullResponse += token;
        client.emit(`receive-message`, token);
      }
    }
    // Save assistant message in GiftedChat format
    await this.saveMessage(userId, fullResponse, Role.Assistant);
  }
}

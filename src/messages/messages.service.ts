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

            Previous spending (if not available, use 0):
            weeklyExpenses: { food: 0, transport: 0, entertainment: 0 }
            monthlyExpenses: { food: 0, transport: 0, entertainment: 0 }
            totalMonthlySpending: 0
            
            Instructions:
            - Respond naturally in conversational style.
            - At the END of your message, append a stringified JSON of updated spending.
            - Wrap the JSON with a PREFIX and POSTFIX for reliable extraction:
            <<<SPENDING_JSON_START>>>
            {
              "weeklyExpenses": { "food": <number>, "transport": <number>, "entertainment": <number> },
              "monthlyExpenses": { "food": <number>, "transport": <number>, "entertainment": <number> },
              "totalMonthlySpending": <number>
            }
            <<<SPENDING_JSON_END>>>
            - If the user hasn’t mentioned any spending, set all numbers to 0.
            give me json response of this object in stringy format in last of message using --INFO-PREFIX--  and --INFO-POSTFIX, if infi about these is not avaliubale give me object with value 0
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
    console.log('fullResponse', fullResponse);
    // Save assistant message in GiftedChat format
    await this.saveMessage(userId, fullResponse, Role.Assistant);
  }
}

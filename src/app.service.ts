import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';

@Injectable()
export class AppService {
  async getHello() {
    // console.log('process.env.GPT_API_KEY', process.env.GPT_API_KEY);
    // const client = new OpenAI({ apiKey: process.env.GPT_API_KEY });
    
    // const models = await client.models.list();
    // console.log(models.data.map((m) => m.id));

    // const response = await client.responses.create({
    //   model: 'gpt-4o-mini',
    //   input: 'Write a short bedtime story about a unicorn.',
    // });

    // console.log(response.output_text);
    return 'Hello Moni!';
  }
}

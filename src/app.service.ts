import { Injectable } from '@nestjs/common';
// import OpenAI from 'openai';
// import jwt, { PrivateKey } from 'jsonwebtoken';
// import axios from 'axios';
// import * as fs from 'fs';
// import * as path from 'path';

// const APPLE_ISSUER_ID = '59657095-081e-43e1-a6df-25491de40042';
// const APPLE_KEY_ID = 'KYZT3B6GHH';
// const APPLE_BUNDLE_ID = 'com.dtt-car-bike-ireland';

@Injectable()
export class AppService {
  async getHello() {
    return 'Moni Backend is running!';
    // console.log('process.env.GPT_API_KEY', process.env.GPT_API_KEY);
    // const client = new OpenAI({ apiKey: process.env.GPT_API_KEY });

    // const models = await client.models.list();
    // console.log(models.data.map((m) => m.id));

    // const response = await client.responses.create({
    //   model: 'gpt-4o-mini',
    //   input: 'Write a short bedtime story about a unicorn.',
    // });

    // console.log(response.output_text);
    // return response.output_text;



//     const privateKey = fs.readFileSync(path.join(process.cwd(), 'SubscriptionKey_KYZT3B6GHH.p8'), "utf8");
// console.log('privateKey',privateKey)
//     function generateAppleToken() {
//       //@ts-ignore
//       return jwt.sign(
//         {
//           iss: APPLE_ISSUER_ID,
//           iat: Math.floor(Date.now() / 1000),
//           exp: Math.floor(Date.now() / 1000) + 300,
//           aud: 'appstoreconnect-v1',
//           bid: APPLE_BUNDLE_ID,
//         },
//         privateKey as PrivateKey,
//         {
//           algorithm: 'ES256',
//           header: { alg: 'ES256', kid: APPLE_KEY_ID, typ: 'JWT' },
//         },
//       );
//     }

//     try {
//       const token = generateAppleToken();
//       console.log('token', token);
//       const originalTransactionId = '2000001050029563';

//       const res = await axios.get(
//         `https://api.storekit-sandbox.itunes.apple.com/inApps/v1/subscriptions/${originalTransactionId}`,
//         { headers: { Authorization: `Bearer ${token}` } },
//       );
//       console.log('res', res?.data);
//       if(res.status == 200){
//       const sub = res.data.data?.[0].lastTransactions?.[0];

//   const transaction = JSON.parse(
//     Buffer.from(sub.signedTransactionInfo.split('.')[1], 'base64').toString()
//   );
//   const renewal = JSON.parse(
//     Buffer.from(sub.signedRenewalInfo.split('.')[1], 'base64').toString()
//   );
//   console.log('transaction',transaction)
//   console.log('renewal',renewal)
//       return { res:res?.data };
// }
//       // const subscription = res.data.data[0]; // latest renewal info

//       // const expires = parseInt(subscription.expiresDate, 10);
//       // const isActive = expires > Date.now();

//       // return {
//       //   active: isActive,
//       //   productId: subscription.productId,
//       //   expiration: new Date(expires),
//       //   environment: res.data.environment,
//       // };
//     } catch (error) {
//       console.log({error})
//       return { error };
//     }
  }
}

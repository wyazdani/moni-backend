import { Injectable } from '@nestjs/common';
// import OpenAI from 'openai';
// import jwt, { PrivateKey } from 'jsonwebtoken';
// import axios from 'axios';

// const APPLE_ISSUER_ID = '59657095-081e-43e1-a6df-25491de40042';
// const APPLE_KEY_ID = '53LAZ53ZX7';
// const APPLE_BUNDLE_ID = 'com.dtt_car_bike_ireland';

// const APPLE_PRIVATE_KEY = `
// -----BEGIN PRIVATE KEY-----
// MIGTAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBHkwdwIBAQQgFOsggXzvsnNoVbMy
// 32VZm8SsCzYcIMgUcc2EWsj5LGqgCgYIKoZIzj0DAQehRANCAAT0KIq/1K+EB51P
// lgZiW+pbQjA2/kDsHQ4cwTvDHBitBtt7YzCF9+RUBTDrHgJ9IBqCo7y+GO7LDe0Z
// ij4XRRBe
// -----END PRIVATE KEY-----
// `;

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

    // const APPLE_API_URL = 'https://api.storekit.itunes.apple.com';

    // function generateAppleToken() {
    //   //@ts-ignore
    //   return jwt.sign(
    //     {
    //       iss: APPLE_ISSUER_ID,
    //       iat: Math.floor(Date.now() / 1000),
    //       exp: Math.floor(Date.now() / 1000) + 300,
    //       aud: 'appstoreconnect-v1',
    //     },
    //     APPLE_PRIVATE_KEY as PrivateKey,
    //     {
    //       algorithm: 'ES256',
    //       header: { kid: APPLE_KEY_ID, typ: 'JWT' },
    //     },
    //   );
    // }

    // try {
    //   const token = generateAppleToken();
    //   console.log('token', token);
    //   const originalTransactionId = '2000001050029563';

    //   const res = await axios.get(
    //     `${APPLE_API_URL}/inApps/v1/subscriptions/${originalTransactionId}`,
    //     { headers: { Authorization: `Bearer ${token}` } },
    //   );
    //   console.log('res', res);
    //   return { res };
    //   const subscription = res.data.data[0]; // latest renewal info

    //   const expires = parseInt(subscription.expiresDate, 10);
    //   const isActive = expires > Date.now();

    //   return {
    //     active: isActive,
    //     productId: subscription.productId,
    //     expiration: new Date(expires),
    //     environment: res.data.environment,
    //   };
    // } catch (error) {
    //   return { error };
    // }
  }
}

import { verify } from '@Libs/jwt';
import { env } from '@Libs/env';
import { UnauthorizedError } from 'routing-controllers';
import Redis from 'ioredis';

interface VerifyOptions {
  publicKey: string;
  cache?: Redis;
  requireCacheMatch?: boolean; // GraphQL mới cần check token trong Redis
}

export async function verifyTokenAndGetPayload(
  token: string,
  options: VerifyOptions
): Promise<any> {
  try {
    const data: any = verify(token, options.publicKey);

    if (options.requireCacheMatch && options.cache) {
      const val = await options.cache.get(data.sub as string);
      if (!val || val !== data['tokenType']) {
        throw new UnauthorizedError('INVALID TOKEN (cache mismatch)');
      }
    }

    return data;
  } catch (err) {
    throw new UnauthorizedError('INVALID OR EXPIRED TOKEN');
  }
}

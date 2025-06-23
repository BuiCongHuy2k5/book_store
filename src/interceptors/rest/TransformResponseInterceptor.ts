import { Model } from 'mongoose';
import { Action, Interceptor, InterceptorInterface } from 'routing-controllers';
import { Service } from 'typedi';

import { convertDocument } from '@Middlewares/graphql/TypegooseMiddleware';
import { log } from 'console';

@Service()
@Interceptor()
export class TransformResponseInterceptor implements InterceptorInterface {
  intercept(action: Action, result: any) {
    console.log("log result",result);
    if (Array.isArray(result.items)) {
      return result.items.map(item => (item instanceof Model ? convertDocument(item) : item)).filter(item => !!item);
    }

    if (result instanceof Model) {
      return convertDocument(result);
    }

    return result;
  }
}

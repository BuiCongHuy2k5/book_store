import { DocumentType } from '@typegoose/typegoose';
import { MiddlewareFn } from 'type-graphql';

export const TypegooseMiddleware: MiddlewareFn = async (_, next) => {
  const result = await next();

  if (Array.isArray(result)) {
    return result.map(item => (isTypegooseDocument(item) ? convertDocument(item) : item)).filter(item => !!item);
  }

  if (isTypegooseDocument(result)) {
    return convertDocument(result);
  }

  return result;
};

// Kiểm tra có phải là DocumentType không
function isTypegooseDocument(doc: any): doc is DocumentType<any> {
  return doc && typeof doc.toObject === 'function' && doc.constructor?.name !== 'Object';
}

// Giữ nguyên prototype khi chuyển document về plain object
export function convertDocument<T>(doc: DocumentType<T>): T {
  const converted = doc.toObject(); // plain object
  Object.setPrototypeOf(converted, Object.getPrototypeOf(doc)); // gán lại prototype class
  return converted as T;
}

import { WinstonLogger } from '@Libs/WinstonLogger';
import { Request, Response, NextFunction } from 'express';
import { ExpressMiddlewareInterface, Middleware, UnauthorizedError } from 'routing-controllers';
import { Service } from 'typedi';
import winston from 'winston';
import bcrypt from 'bcrypt';
import { Logger } from '@Decorators/Logger';
import { AccountRepository } from '@Repositories/AccountRepository'; // Thư viện truy xuất dữ liệu từ cơ sở dữ liệu

@Service()
@Middleware({ type: 'before' })
export class AuthenticationMiddleware implements ExpressMiddlewareInterface {
  constructor(
    @Logger(module) private logger: winston.Logger,
    private accountRepo: AccountRepository // Đảm bảo bạn đã inject repository đúng cách
  ) { }

  public async use(req: Request, res: Response, next: NextFunction): Promise<void> {
    const logger = WinstonLogger.create(module);
    const rawUrl = (req.originalUrl || req.url || '').split('?')[0];
    const url = rawUrl.toLowerCase().replace(/\/+$/, ''); // Remove trailing slash
    const method = (req.method || 'GET').toUpperCase();

    // Bỏ qua các route công khai (whitelisted routes)
    const whitelist = [
      { method: 'POST', pattern: /^\/api\/account$/ },       // POST /api/account  (create account)
      { method: 'POST', pattern: /^\/api\/account\/login$/ } // POST /api/account/login
    ];

    const isWhitelisted = whitelist.some(
      w => (w.method === 'ALL' || w.method === method) && w.pattern.test(url),
    );

    if (isWhitelisted) {
      logger.debug(`AuthenticationMiddleware: public route matched ${method} ${url}`);
      return next(); // Bỏ qua xác thực cho các route trong whitelist
    }

    // Kiểm tra Authorization header cho Basic Auth
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Basic ')) {
      logger.info(`AuthenticationMiddleware: missing/invalid auth header for ${method} ${url}`);
      throw new UnauthorizedError('Missing or invalid Authorization header');
    }

    const base64Credentials = authHeader.split(' ')[1]; // Lấy Base64 credentials
    const buffer = Buffer.from(base64Credentials, 'base64');
    const [username, password] = buffer.toString('utf-8').split(':'); // Tách username và password
    try {
      // Kiểm tra username và password hợp lệ
      const account = await this.accountRepo.getByUserName(username); // Lấy tài khoản từ cơ sở dữ liệu

      if (!account) {
        logger.info(`AuthenticationMiddleware: Account not found for ${username}`);
        throw new UnauthorizedError('Invalid username or password');
      }

      // Kiểm tra mật khẩu (bảo mật mật khẩu bằng bcrypt)
      const isPasswordValid = await bcrypt.compare(password, account.passWord);
      if (!isPasswordValid) {
        logger.info(`AuthenticationMiddleware: Invalid password for ${username}`);
        throw new UnauthorizedError('Invalid username or password');
      }

      // Nếu thông tin hợp lệ, gán thông tin người dùng vào request
      (req as any).identity = account.userName; // Gán username làm identity
      (req as any).roles = account.role || []; // Các vai trò của người dùng từ cơ sở dữ liệu

      logger.debug(`AuthenticationMiddleware: authenticated user ${username}`);
      return next(); // Tiếp tục xử lý request
    } catch (err) {
      logger.error('Error during Basic Auth verification', err); // Ghi log chi tiết lỗi nếu có
      throw new UnauthorizedError('Invalid or expired credentials');
    }
  }
}


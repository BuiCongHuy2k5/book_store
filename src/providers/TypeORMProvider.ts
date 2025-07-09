
import winston from 'winston';
import { Container, Inject, Service } from 'typedi';
import { DataSource, DataSourceOptions } from 'typeorm';

import { Logger } from '@Decorators/Logger';

import ServiceProvider from '@Libs/provider/ServiceProvider';
import { env } from '@Libs/env';
import { appEvent } from '@Libs/appEvent';
import { getLoggingLevel } from '@Libs/helper';
import { TypeORMLogger } from '@Libs/TypeORMLogger';
import { Category } from 'databases/postgres/entities/Category';
import { Author } from 'databases/postgres/entities/Author';
import { Image } from 'databases/postgres/entities/Image';
import { Book } from 'databases/postgres/entities/Book';
import { BookDetail } from 'databases/postgres/entities/BookDetail';
import { Publisher } from 'databases/postgres/entities/Publisher';

@Service()
export default class TypeORMProvider extends ServiceProvider {
  private dataSource: DataSource;

  constructor(
    @Logger(module) private logger: winston.Logger,
    @Inject('rootPath') private readonly rootPath: string
  ) {
    super();
  }

  async register(): Promise<void> {
    const loggingOptions = getLoggingLevel(env.db.logging);

    const options: DataSourceOptions = {
      type: env.db.type as any,
      host: String(env.db.host),
      port: Number(env.db.port),
      username: String(env.db.username),
      password: String(env.db.password),
      database: String(env.db.database),
      synchronize: env.db.synchronize = false, // ✅ KHÔNG được gán lại biến môi trường
      logging: loggingOptions,
      logger: new TypeORMLogger(loggingOptions),
      migrations: env.db.migrations || [],

      // ✅ Dùng import trực tiếp các entity class
      entities: [
        Category,
        Image,
        Author,
        Book,
        BookDetail,
        Publisher,
        // thêm entity khác nếu có
      ],

      cache: true,
    };

    this.dataSource = new DataSource(options);
    Container.set('dataSource', this.dataSource);
  }

  async boot(): Promise<void> {
    await this.dataSource.initialize();
    appEvent.emit('db_connected', env.db.type);
    appEvent.on('shutdown', () => {
      this.dataSource.destroy();
    });
  }
}
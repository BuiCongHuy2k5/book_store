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
import { Book } from 'databases/postgres/entities/Book';
import { Author } from 'databases/postgres/entities/Author';
import { Customer } from 'databases/postgres/entities/Customer';
import { Employee } from 'databases/postgres/entities/Employee';
import { Invoice } from 'databases/postgres/entities/Invoice';
import { Cart } from 'databases/postgres/entities/Cart';
import { Publisher } from 'databases/postgres/entities/Publisher';
import { Inventory } from 'databases/postgres/entities/Inventory';
import { Account } from 'databases/postgres/entities/Account';

@Service()
export default class TypeORMProvider extends ServiceProvider {
  private dataSource: DataSource;

  constructor(
    @Logger(module) private logger: winston.Logger,
    @Inject('rootPath') private readonly rootPath: string,
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
      synchronize: env.db.synchronize === true, // ✅ KHÔNG được gán lại biến môi trường
      logging: loggingOptions,
      logger: new TypeORMLogger(loggingOptions),
      migrations: env.db.migrations || [],

      // ✅ Dùng import trực tiếp các entity class
      entities: [Category, Book, Author, Customer, Employee, Invoice, Cart, Publisher, Inventory, Account],

      cache: true,

      ssl: {
        rejectUnauthorized: false,
      },
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

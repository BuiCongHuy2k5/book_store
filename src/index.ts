import 'reflect-metadata';
import { Container, Service } from 'typedi';
import winston from 'winston';

import { Logger } from '@Decorators/Logger';

import { appEvent } from '@Libs/appEvent';
import { Kernel } from '@Libs/Kernel';
import { env } from '@Libs/env';
import { Application } from "express";

@Service()
class MainApplication {
  constructor(@Logger(module) private readonly logger: winston.Logger) { }

  public async bootstrap() {
    Container.set('rootPath', __dirname);

    try {
      if (env.apmEnabled) {
        const agent = require('elastic-apm-node').start();
        Container.set('apmAgent', agent);
      }

      let providers = Kernel.providers;

      // Đăng ký tất cả provider
      for (let provider of providers) {
        this.logger.info(`Registering provider: ${provider.name}`);
        await Container.get(provider).register();
      }

      // Khởi động tất cả provider
      for (let provider of providers) {
        this.logger.info(`Booting provider: ${provider.name}`);
        await Container.get(provider).boot();
      }

      // Xử lý signal
      process.on('uncaughtException', (err) => {
        this.logger.error('Uncaught Exception thrown', err);
      });

      const handleClose = async (signal: string) => {
        this.logger.info(`${signal} signal received.`);
        const closingProviders = [...providers];
        for (let provider of closingProviders.reverse()) {
          await Container.get(provider).close();
        }
        appEvent.emit('process_closed');
      };

      process.on('SIGTERM', handleClose);
      process.on('SIGINT', handleClose);

      appEvent.on('process_closed', () => {
        this.logger.info('Successfully closed process.');
        process.exit(0);
      });

      // ✅ Start server sau khi boot provider
      const PORT = Number(process.env.PORT) || 3000; // Mặc định 3000 cho cục bộ

      if (!process.env.PORT) {
        this.logger.warn('PORT environment variable is not defined, using default port 3000');
      }

      // Debug: Kiểm tra xem expressApp có được đăng ký không
      this.logger.info(`Is expressApp registered? ${Container.has('expressApp')}`);

      // Lấy expressApp từ container
      const app = Container.get<Application>('expressApp');

      app.listen(PORT, () => {
        this.logger.info(`🚀 Server is running on ${PORT}`);
      });
    } catch (err) {
      this.logger.error('Error occurs during bootstrap: ', err);
      appEvent.emit('shutdown');
      process.exit(1);
    }
  }
}

Container.get(MainApplication).bootstrap();

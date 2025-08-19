import { Server as HttpServer } from 'http';
import path from 'path';
import { Container, Inject, Service } from 'typedi';
import { Server } from 'socket.io';
import Redis from 'ioredis';
import { createAdapter } from '@socket.io/redis-adapter';
import { SocketControllers } from 'socket-controllers'; // Bỏ qua import socketUseContainer
import { appEvent } from '@Libs/appEvent';
import ServiceProvider from '@Libs/provider/ServiceProvider';

@Service()
export default class SocketProvider extends ServiceProvider {
  private socketIO: Server;

  constructor(
    @Inject('httpServer') private readonly httpServer: HttpServer,
    @Inject('cache') private readonly cache: Redis,
    @Inject('rootPath') private readonly rootPath: string,
  ) {
    super();
  }

  async register(): Promise<void> {
    this.socketIO = new Server(this.httpServer, {
      cors: {
        origin: '*',
        methods: ['GET', 'POST'],
      },
    });

    // Không cần gọi socketUseContainer nữa nếu không sử dụng
    Container.set('socket', this.socketIO); // Cho phép inject socket vào Container
  }

  async boot(): Promise<void> {
    // Tạo một client phụ của Redis cho việc giao tiếp với Redis Adapter
    const subClient = this.cache.duplicate();
    this.socketIO.adapter(createAdapter(this.cache, subClient));

    // Sử dụng SocketControllers với cấu hình chính xác
    new SocketControllers({
      container: Container,
      controllers: [path.join(this.rootPath, 'sockets/controllers/*Controller.{ts,js}')],
      middlewares: [path.join(this.rootPath, 'middlewares/socket/*Middleware.{ts,js}')],
    });

    // Emit sự kiện khi socket server đã bắt đầu
    appEvent.emit('socket_started');
  }
}

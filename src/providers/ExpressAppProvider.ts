import { Service, Container } from 'typedi';
import express, { Application } from 'express';

@Service()
export class ExpressAppProvider {
    private app: Application;

    constructor() {
        this.app = express();
        // Cấu hình middleware cơ bản
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
        // Route kiểm tra cơ bản
        this.app.get('/', (req, res) => {
            res.send('Hello, World!');
        });
    }

    async register() {
        // Đăng ký expressApp vào container
        Container.set('expressApp', this.app);
    }

    async boot() {
        // Logic khởi động nếu cần (ví dụ: thêm middleware hoặc route khác)
    }

    async close() {
        // Logic đóng nếu cần
    }
}
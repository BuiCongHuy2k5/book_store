import { Service } from 'typedi';

import { UserRepository } from '@Repositories/UserRepository';
import { User } from 'databases/postgres/entities/User';

@Service()
export class DemoService {
  constructor(private readonly userRepo: UserRepository) {}

  async findByIds(ids: string[]) {
    return [
      {
        _id: '1',
        name: 'quang',
      },
    ];
  }

  async createUser(name: string) {
    const user = new User();
    user.name = name;
    return this.userRepo.create(user);
  }
}

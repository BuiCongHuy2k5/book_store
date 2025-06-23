import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class UpdateUserRespone {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  email: string;

  @Expose()
  phoneNumber: string;

  @Expose()
  userName: string;

  @Expose()
  birtDate?: Date;

  @Expose()
  genDer?: string;

  constructor(partial: Partial<UpdateUserRespone>) {
    Object.assign(this, partial);
  }
}

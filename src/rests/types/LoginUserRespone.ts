import { Exclude, Expose } from "class-transformer";
import { CreateUserResponse } from "./CreateUserRespone";


@Exclude()
export class LoginUserRespone{
    @Expose()
    token: string;

    @Expose()
    user: CreateUserResponse;

    constructor(partial: Partial<LoginUserRespone>){
        Object.assign(this, partial);
    }
}
import { RestRoles } from "@Enums/RestRoles";
import { IsDateString, IsEmail, IsEnum, IsString, Matches } from "class-validator";

export class CreateUserInput {
    @IsString()
    name: string;
    @IsEmail()
    @Matches(/^[\w-\.]+@gmail\.com$/, {
    message: 'EMAIL MUST BE A VALID EMAIL ADDRESS @gmail.com',
    })
    email: string;
    @IsString()
    @Matches(/^(0|\+84)\d{9}$/, {
    message: 'INVALID PHONE NUMBER, MINIMUM 10 DIGITS AND NO LETTERS',
    })
    phoneNumber: string;
    @IsString()
    passWord: string;
    @IsString()
    userName: string;
    @IsEnum(RestRoles, {message: 'GENDER MUST BE "MALE" OR "FEMALE"'})
    genDer: RestRoles;
    @IsDateString({}, { message: 'BIRTH DATE MUST BE A VALID ISO DATE STRING YYY-MMM-DDD' })
    birtDate:Date;
}
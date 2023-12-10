import { IsEmail, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateCustomerDto {
    @IsNumber()
    id: number;

    @IsString()
    name: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;
}

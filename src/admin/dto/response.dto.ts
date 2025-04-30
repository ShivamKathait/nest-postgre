import { IsBoolean, IsEmail, IsNumber, IsString } from "class-validator";

export class ResponseUserDto {
    @IsNumber()
    id: number;
  
    @IsString()
    name: string;
  
    @IsString()
    @IsEmail()
    email: string;
  
    @IsString()
    access_token: string;
  
    @IsString()
    role: string;
  
    @IsBoolean()
    is_email_verified:boolean;
  
    constructor(partial: Partial<ResponseUserDto>) {
      Object.assign(this, partial);
    }
  }
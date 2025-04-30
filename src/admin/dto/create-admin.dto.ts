import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsEnum, IsNotEmpty, IsString, IsStrongPassword, Length, MinLength } from "class-validator";
import { Device_TYPE } from "src/common/utils";

export class CreateAdminto {
    @ApiProperty({ default: "john@yopmail.com" })
    @IsEmail({}, { message: 'Email must be an valid email address' })
    @IsNotEmpty({ message: 'Email is required' })
    email: string;
  
    @ApiProperty()
    @Length(8, 20, { message: 'Password must be between 8 and 20 characters long' })
    @IsNotEmpty({ message: 'password is required' })
    @IsStrongPassword({
      minLength: 6,
      minLowercase: 1,
      minNumbers: 1,
      minSymbols: 1,
      minUppercase: 1
    })
    @IsString()
    password: string;
}

export class OtpDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'otp is required' })
  @MinLength(4, { message: "otp must be atleast 6 characters" })
  @IsString()
  otp: string;
}

export class LoginDto {
  @ApiProperty({ default: "john@yopmail.com" })
  @IsEmail({}, { message: 'Email must be an valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'password is required' })
  @IsString()
  @MinLength(6)
  password: string;

}
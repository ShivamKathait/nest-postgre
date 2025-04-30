import { Injectable } from '@nestjs/common';
import { CreateAdminto, LoginDto, OtpDto } from './dto/create-admin.dto';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import * as Errors from "../error-handler/error-service";
import { InjectRepository } from '@nestjs/typeorm';
import { Admin } from './entities/admin.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Role } from 'src/common/utils';
import { JwtService } from '@nestjs/jwt';
import { validate } from 'class-validator';
import { Session } from './entities/session.entity';
import { ResponseUserDto } from './dto/response.dto';

@Injectable()
export class AdminService {
  private country_api: string
  private accessKey: string
  private JWT_ACCESS_SECRET: string
  private JWT_ACCESS_EXPIRY: string
  private JWT_ACCESS_TEMP_SECRET: string
  private JWT_ACCESS_TEMP_EXPIRY: string
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private readonly httpService: HttpService,
    @InjectRepository(Admin) private readonly adminModel: Repository<Admin>,
    @InjectRepository(Session) private readonly sessionModel: Repository<Session>,
  ) {
    this.country_api = this.configService.get<string>('FETCH_COUNTRY_API')!
    this.accessKey = this.configService.get<string>('ACCESS_KEY')!
    this.JWT_ACCESS_SECRET = this.configService.get<string>('JWT_ACCESS_SECRET')!
    this.JWT_ACCESS_EXPIRY = this.configService.get<string>('JWT_ACCESS_EXPIRY')!

    this.JWT_ACCESS_TEMP_SECRET = this.configService.get<string>('JWT_ACCESS_TEMP_SECRET')!
    this.JWT_ACCESS_TEMP_EXPIRY = this.configService.get<string>('JWT_ACCESS_TEMP_EXPIRY')!

  }

  private async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  private compareHash(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  async generateTempToken(
    id: number,
    email: string, role: string
  ) {
    return this.jwtService.sign(
      { id, email, role },
      {
        secret: this.JWT_ACCESS_TEMP_SECRET,
        expiresIn: this.JWT_ACCESS_TEMP_EXPIRY
      }
    );
  }

  async generateToken(
    _id: number,
    session_id: number,
    email: string, role: string) {
    return this.jwtService.sign(
      { _id, email, role, session_id },
      {
        secret: this.JWT_ACCESS_SECRET,
        expiresIn: this.JWT_ACCESS_EXPIRY
      }
    );
  }

  async generate_otp(user_id: number) {
    try {
      let otp = "1234"
      const otpDetails = {
        otp,
        otp_expire_at: new Date(new Date().getTime() + 1 * 60000),
      };
      const query = { id: user_id };
      await this.adminModel.update(query, otpDetails);
      return
    } catch (error) {
      throw error
    }
  }

  async getCountryFromIP(ip) {
    try {
      let url = `http://ip-api.com/json/${ip}`;
      let response = await firstValueFrom(this.httpService.get(url));
      const result = response?.data;
      console.log("result", result);

      return result?.countryCode
    } catch (error) {
      throw error
    }
  }

  async register(createUserDto: CreateAdminto, ip) {
    try {
      let { email, password } = createUserDto;
      if (ip === '::1' || ip === '127.0.0.1') {
        ip = '8.8.8.8';
      }
      let country_code = await this.getCountryFromIP(ip);
      let unauthorizedCountry = ["SY", "AF", "IR"]
      if (unauthorizedCountry.includes(country_code)) {
        throw new Errors.UnauthorizedCountry()
      }
      const query = {
        where: { email: email.toLowerCase(), is_deleted: false },
        select: { email: true, name: true }
      };
      let isUser = await this.adminModel.findOne(query);
      if (isUser) throw new Errors.EmailExist();
      let hashPassword = await this.hashPassword(password);
      let data = {
        email: email.toLowerCase(),
        password: hashPassword,
        role: Role.ADMIN,
        created_at: new Date()
      }
      let admin = await this.adminModel.save(data);
      await this.generate_otp(admin.id)
      let access_token = await this.generateTempToken(admin.id, admin.email, admin.role)
      return { access_token }
    } catch (error) {
      throw error
    }
  }

  async verify_otp(dto: OtpDto, user) {
    try {
      const { otp } = dto;
      const query = {
        where: { id: user.id },
        select: { otp: true, otp_expire_at: true }
      };
      let fetch_user = await this.adminModel.findOne(query);
      if (!fetch_user) throw new Errors.UserNotFound()
      if (fetch_user.otp_expire_at && new Date(fetch_user.otp_expire_at) < new Date()) {
        throw new Errors.OtpExipred();
      }
      if (Number(fetch_user.otp) !== Number(otp)) {
        throw new Errors.InvalidOtp();
      }
      let update = { otp_expire_at: null, otp: null, is_email_verified: true }
      await this.adminModel.update(user.id, update);
      let data = { message: "Otp verified successfully." }
      return { data }
    } catch (error) {
      console.log("error----", error);
      throw error
    }
  }


  async createSession(admin_id: number, role: string) {
    return await this.sessionModel.save({ admin_id: { id: admin_id }, role: role as Role, })
  }


  async login(dto: LoginDto) {
    try {
      let { email, password } = dto;
      let query = { where: { email: email.toLowerCase(), is_deleted: false }, }

      let isUser = await this.adminModel.findOne(query);
      if (!isUser) throw new Errors.UserNotExist();
      isUser = { ...isUser }
      if (isUser.is_email_verified === false) {
        console.log("is_user", isUser);
        let access_token = await this.generateTempToken(isUser.id, isUser.email, isUser.role)
        await this.generate_otp(isUser.id);
        let data = { is_email_verified: isUser.is_email_verified, access_token }
        return { data }
      }
      let isPassword = await this.compareHash(password, isUser.password);
      if (!isPassword) throw new Errors.IncorrectCreds();
      let session = await this.createSession(isUser.id, isUser.role);
      let access_token = await this.generateToken(isUser.id, session.id, isUser.email, isUser.role)
      const userData = { ...isUser, access_token };
      const response = new ResponseUserDto(userData);
      await validate(response, { whitelist: true });
      let data = { message: "Login successfully.", ...response }
      return { data }
    } catch (error) {
      throw error
    }
  }
}

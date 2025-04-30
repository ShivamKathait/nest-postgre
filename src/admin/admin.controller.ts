import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards, Res } from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateAdminto, LoginDto, OtpDto } from './dto/create-admin.dto';
import * as requestIp from 'request-ip';
import { ApiBearerAuth, ApiConsumes, ApiOperation } from '@nestjs/swagger';
import { Role } from 'src/common/utils';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { TempAuthGuard } from 'src/auth/guards/temp-auth.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

   /**
   *  admin will register here 
   * @param {CreateAdminto } dto
   * @returns
   */
  @Post('register')
  async register(@Req() req,@Body() dto: CreateAdminto) {
    const ip = requestIp.getClientIp(req);
    return await this.adminService.register(dto,ip);
  }

  /**
   *  Will handle the admin otp verification controller logic
   * @param {OtpDto } dto
   * @returns
   */
  @ApiBearerAuth("authorization")
  @Roles(Role.ADMIN)
  @UseGuards(TempAuthGuard, RolesGuard)
  @Patch('verify/otp')
  @ApiConsumes('application/json', 'application/x-www-form-urlencoded')
  @ApiOperation({ summary: `Admin Verify Otp Api` })
  async verify_otp(@Body() dto: OtpDto, @Req() req) {
    return await this.adminService.verify_otp(dto, req.user);
  }
  

  /**
   *  Will handle the admin login controller logic
   * @param {LoginDto} dto - The admin login data
   * @returns
   */
  @Post('login')
  @ApiConsumes('application/json', 'application/x-www-form-urlencoded')
  @ApiOperation({ summary: `Admin Login Api` })
  async login(@Body() dto: LoginDto) {
    return await this.adminService.login(dto);
  }

  
}

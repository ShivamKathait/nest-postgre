import { Injectable, Inject } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Admin } from 'src/admin/entities/admin.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Session } from 'src/admin/entities/session.entity';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class TempStrategy extends PassportStrategy(Strategy, 'temp-jwt') {
    constructor(
        private configService: ConfigService,
        @InjectRepository(Admin) private readonly adminModel: Repository<Admin>,
        @InjectRepository(Session) private readonly sessionModel: Repository<Session>,
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get<string>("JWT_ACCESS_TEMP_SECRET")
        })
    }

    async validate(payload: any) {
        const userId = payload.id;
        const cacheKey = `auth:temp-user:${userId}`;

        // Try to get from cache first
        const cachedUser = await this.cacheManager.get(cacheKey);
        if (cachedUser) {
            return cachedUser;
        }

        // Cache miss - fetch from database
        const query = {
            where: { id: userId, is_deleted: false },
            select: { password: false }
        };
        const user = await this.adminModel.findOne(query);
        if (!user) return null;

        // Cache the user data for 5 minutes (temp tokens are short-lived)
        await this.cacheManager.set(cacheKey, user, 300000);

        return user;
    }
}
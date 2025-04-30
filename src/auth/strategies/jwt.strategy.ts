import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Admin } from 'src/admin/entities/admin.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Session } from 'src/admin/entities/session.entity';


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(
        private configService: ConfigService,
        @InjectRepository(Admin) private readonly adminModel: Repository<Admin>,
        @InjectRepository(Session) private readonly sessionModel: Repository<Session>,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get<string>("JWT_ACCESS_SECRET")
        })
    }

    async validate(payload: any) {
        const query = {
            where: { id: payload.id, is_deleted: false },
            select: { password: false }
        };
        const user = await this.adminModel.findOne(query);
        if (!user) return null;
        const sessionQuery = { where: { id: payload.session_id } }
        const session = await this.sessionModel.findOne(sessionQuery);
        if (!session) return null;
        Object.assign(user, { session_id: payload.session_id })
        return user;
    }
}

import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Request } from "express";
import { ExtractJwt, Strategy } from "passport-jwt";

export interface JwtPayload {
    sub: string;
    emailAddress: string;
}

// https://www.youtube.com/watch?v=uAKzFhE3rxU
@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(
        private configService: ConfigService
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get<string>('jwt.accessToken.secret'),
            passReqToCallback: true
        });
    }

    async validate(req: Request, payload: JwtPayload) {
        const token = req.get('authorization').replace('Bearer', '').trim();

        return {
            ...payload,
            token
        };
    }
}
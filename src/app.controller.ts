import { Controller, Get, Request, UseGuards } from "@nestjs/common";

@Controller()
export class AppController {
    
    @Get('me')
    getProfile(@Request() req) {
        return req.user;
    }
}
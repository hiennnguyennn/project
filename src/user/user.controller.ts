import { InjectQueue } from '@nestjs/bull';
import { Body, Controller, Get, HttpException, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiResponse } from '@nestjs/swagger';
import { Queue } from 'bull';
import { Response } from 'express';
import { AuthService } from 'src/auth/auth.service';
import { UserLoginDto } from './DTO/user.login.dto';
import { UserService } from './user.service';
import { UserDto } from './DTO/userDto';
import { Auth } from 'src/auth/decorator/auth.decorator';

@Controller('user')
export class UserController {
    constructor(private userService: UserService, @InjectQueue('mail') private readonly mailQueue: Queue, private authService: AuthService) { }
   
    // @Get()
    // @ApiResponse({ status: 200, description: 'The list of users.' })
    // async show() {
    //     const users = await this.userService.findAll();
    //     return users;
    // }

 
    @UseGuards(AuthGuard('local'))
    @Post('login')
    @ApiResponse({ status: 201, description: 'The user has been successfully login.' })
   // @ApiResponse({ status: 404, description: 'Account not found' })
    @ApiResponse({ status: 401, description: 'Account not found' })
    async handleLogin(@Req() Req,@Res({ passthrough: true }) Res: Response, @Body() user: UserLoginDto) {
        var jwt=await this.authService.login(Req.user);
        Res.cookie('jwt',jwt);
        return Req.user;
        // const result = await this.userService.handleLogin(user);
        // //return result;
        // if (result == 'not exist mail') {
        //     throw new HttpException('Account not found', 404)
        // }
        // else if (result == 'wrong password') {
        //     throw new HttpException('Wrong password', 200)
        // }
        // else {
        //     Res.cookie('jwt', result['jwt'], { httpOnly: true });
        //     return result['u'];
            
        // };
    }

    @Post('register')
    @ApiResponse({ status: 201, description: 'The user has been successfully login.' })
    @ApiResponse({ status: 409, description: 'Email used' })
    async handleRegister(@Res({ passthrough: true }) Res: Response, @Body() user: UserDto) {
        const result = await this.userService.saveUser(user);
        if (result == 'exist') {
            throw new HttpException('Email used', 409)
        }
        else {
            var jwt=await this.authService.login(result);
            Res.cookie('jwt',jwt, { httpOnly: true });
            return result;
        }
    }


    // @UseGuards(AuthGuard('local'))
    // @Post('sign-in')
    // async signIn(@Req() Req,@Body() user:UserLoginDto, @Res({ passthrough: true }) Res: Response) {
    //     var jwt = await this.authService.login(Req.user);
    //     Res.cookie('jwt', jwt, { httpOnly: true });
    //    // console.log(Req.user);
    //     //console.log(user);
    //     return jwt;
    // }

    @Auth('user')
    @Get('profile')
    getProfile(@Req() req) {
       // console.log(req.user);
        const u=req.user;
        return u;
    }
}
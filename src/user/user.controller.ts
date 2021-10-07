import { InjectQueue } from '@nestjs/bull';
import { Body, Controller, Get, HttpException, Post, Render, Req, Res, UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiBody, ApiCreatedResponse, ApiResponse } from '@nestjs/swagger';
import { Queue } from 'bull';
import { Response } from 'express';
import { AuthService } from 'src/auth/auth.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

import { UserLoginDto } from './user.login.dto';
import { UserService } from './user.service';
import { UserDto } from './userDto';

@Controller('user')
export class UserController {
    // private authService: AuthService;
    constructor(private userService: UserService, private jwtService: JwtService, @InjectQueue('mail') private readonly mailQueue: Queue, private authService: AuthService) { }
    @Get()
    @ApiResponse({ status: 200, description: 'The list of users.' })
    async show() {
        const users = await this.userService.findAll();
        return users;
    }

    // @Get('login')
    // @Render('login')
    // login() {
    // };

    @Post('login')
    @ApiResponse({ status: 201, description: 'The user has been successfully login.' })
    @ApiResponse({ status: 404, description: 'Account not found' })
    @ApiResponse({ status: 401, description: 'Wrong password' })
    //@ApiResponse({ status: 404, description: 'Forbidden.' })
    //@ApiBody({ type: UserDto })
    async handleLogin(@Res({ passthrough: true }) Res: Response, @Body() user: UserLoginDto) {

        const result = await this.userService.handleLogin(user);
        //return result;
        if (result == 'not exist mail') {
            throw new HttpException('Account not found', 404)
        }
        else if (result == 'wrong password') {
            throw new HttpException('Wrong password', 200)
        }
        else {
            //const jwt = await this.jwtService.sign({ id: result.id, email: result.email });
            Res.cookie('jwt', result['jwt'], { httpOnly: true });
            return result['u'];
            //Res.json(result);
            //Res.json(jwt);
            //.json(users.existMail)
        };
    }

    @Post('register')
    @ApiResponse({ status: 201, description: 'The user has been successfully login.' })
    @ApiResponse({ status: 409, description: 'Email used' })
    //@ApiBody({ type: UserDto })
    async handleRegister(@Res({ passthrough: true }) Res: Response, @Body() user: UserDto) {
        const result = await this.userService.saveUser(user);
        if (result == 'exist') {
            throw new HttpException('Email used', 409)
        }
        else {
            // const jwt = await this.jwtService.sign({ id: result.id, email: result.email });
            Res.cookie('jwt', result['jwt'], { httpOnly: true });
            return result['u'];
        }
    }


    @UseGuards(AuthGuard('local'))
    @Post('sign-in')
    async signIn(@Req() req, @Res({ passthrough: true }) Res: Response) {
        //  console.log(req.user);
        var jwt = await this.authService.login(req.user);
        Res.cookie('jwt', jwt, { httpOnly: true });
        console.log(jwt);
        console.log(req.user);
        return jwt;
    }

    @UseGuards(JwtAuthGuard)
    @Get('profile')
    getProfile(@Req() req) {
        console.log(req.user);
        //return this.jwtService.verify(req.cookies['jwt'])
        const u=req.user;
        return u;
    }

    // @Get('transcode')

    // async transcode(@Req() Req,@CurrentUser(JwtService) c){

    //     return this.jwtService.verify(Req.cookies['jwt'])
    //    return c;}
    // console.log(x    }
    // @Post('register')
    // @ApiResponse({ status: 201, description: 'The user has been successfully login.' })
    // @ApiResponse({ status: 403, description: 'Forbidden.' })
    // @ApiBody({ type: UserDto })
    // async handleRegister(@Res() Res: Response, @Body() user: UserDto) {
    //const result = await this.userService.saveUser(user);
    // if (users === 'exist') {
    //     Res.render('register', {
    //         user,
    //         err: 'Account exist'
    //     })
    // }
    // else Res.json(users);
    //return user;
    //}
    // handle(@Res() res: Response, @Body() p) {
    //   return res.render(
    //     'login',
    //     { p },
    //   );
    // };

    // @Get('register')
    // @Render('register')
    // register() {

    // };

}

import { InjectQueue } from '@nestjs/bull';
import { Body, Controller, Get, HttpException, Patch, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiResponse } from '@nestjs/swagger';
import { Queue } from 'bull';
import { Response } from 'express';
import { AuthService } from 'src/auth/auth.service';
import { UserLoginDto } from './dto/user.login.dto';
import { UserService } from './user.service';
import { UserDto } from './dto/userDto';
import { Auth } from 'src/common/decorator/auth.decorator';
import { UserForgotPassDto } from './dto/user.forgot.dto';

@Controller('user')
export class UserController {
    constructor(private userService: UserService, private authService: AuthService) { }
    
    @UseGuards(AuthGuard('local'))
    @Post('login')
    @ApiResponse({ status: 201, description: 'The user has been successfully login.' })
   // @ApiResponse({ status: 404, description: 'Account not found' })
    @ApiResponse({ status: 401, description: 'Account not found' })
    async handleLogin(@Req() Req,@Res({ passthrough: true }) Res: Response, @Body() user: UserLoginDto) {
        var jwt=await this.authService.login(Req.user);
        Res.cookie('jwt',jwt);
        return Req.user;
    }

    @Post('register')
    @ApiResponse({ status: 201, description: 'The user has been successfully login.' })
    @ApiResponse({ status: 409, description: 'Email used' })
    async handleRegister(@Res({ passthrough: true }) Res: Response, @Body() user: UserDto) {
        // const result = await this.userService.saveUser(user);
        // if (result == 'exist') {
        //     throw new HttpException('Email used', 409)
        // }
        // else {
        //     var jwt=await this.authService.login(result);
        //     Res.cookie('jwt',jwt, { httpOnly: true });
        //     return result;
        // }
        const result= await this.authService.register(user);
        console.log(result['jwt'])
        Res.cookie('jwt',result['jwt']);
        return result['user']
    }

    // @Patch('forgot')
    // @ApiResponse({ status: 200, description: 'Edit successfully.' })
    //  @ApiResponse({ status: 404, description: 'Email not found' })
    // async handleForget(@Body() email:UserForgotPassDto){
    //     const result=await this.userService.forgotPassword(email['email']);
    //     if(result=='user not found') throw new HttpException('Email not found',404)
    //     else return result;
    // }

    @Auth('user')
    @Get('profile')
    getProfile(@Req() req) {
        const u=req.user;
        return u;
    }
}
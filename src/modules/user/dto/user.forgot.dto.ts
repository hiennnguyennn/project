import { ApiProperty } from "@nestjs/swagger";

export class UserForgotPassDto{

    @ApiProperty({
        type:String,
        description:'email',
        default:'@email.com',
    })
    readonly email:string;
}
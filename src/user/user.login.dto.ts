import { ApiProperty } from "@nestjs/swagger";

export class UserLoginDto{

    @ApiProperty({
        type:String,
        description:'email',
        default:'@email.com',
    })
    readonly email:string;

    @ApiProperty({
        type:String,
        description:'password',
        default:'',
    })
    readonly password:string;
}
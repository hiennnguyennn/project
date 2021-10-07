import { ApiProperty } from "@nestjs/swagger";
import { User } from "src/user/user.entity";

export class TagNameDto{
    @ApiProperty({
        type:String,
        description:'tag name',
        default:'#'
    })
     tag:string;

    // @ApiProperty({
    //     type:Number,
    //     description:'user created',
    //     default:0,
    // })
    // readonly createdUserId:Number;
}
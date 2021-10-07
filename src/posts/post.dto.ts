import { ApiProperty } from "@nestjs/swagger";
import { isArray } from "util";

export class PostDto{
    @ApiProperty({
        type:String,
        description:'post name',
        default:''
    })
    readonly name:string;

    @ApiProperty({
        type:String,
        description:'post content',
        default:''
    })
    readonly content:string;

    @ApiProperty({
        type:["file"],
        description:'post file',
        required:false,
        default:[]
    })
    readonly file:any[];

    @ApiProperty({
        type:[Number],
        description:'post tag',
       default:[]
    })
    readonly tag:number[];

    // @ApiProperty({
    //     type:Number,
    //     description:'userId created',
    //     default:0,
    // })
    // readonly createdUserId:number;
}
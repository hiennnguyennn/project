import { ApiProperty } from "@nestjs/swagger";
import { isArray } from "util";

export class PostEditDto{
    @ApiProperty({
        type:String,
        description:'post name',
        default:'',
        required:false
    })
    readonly name?:string;

    @ApiProperty({
        type:String,
        description:'post content',
        default:'',
        required:false
    })
    readonly content?:string;

    @ApiProperty({
        type:["file"],
        description:'post file',
        default:[],
        required:false
    })
    readonly file?:any[];

    @ApiProperty({
        type:[Number],
        description:'post tag',
       default:[],
       required:false
    })
    readonly tag?:number[];
}
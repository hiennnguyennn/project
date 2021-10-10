import { ApiProperty } from "@nestjs/swagger";

export class CommentDto{
    @ApiProperty({
        type:String,
        description:'Comment content',
        default:''
    })
    readonly content:string;
}
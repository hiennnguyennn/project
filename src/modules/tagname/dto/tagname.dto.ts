import { ApiProperty } from "@nestjs/swagger";

export class TagNameDto{
    @ApiProperty({
        type:String,
        description:'tag name',
        default:'#'
    })
     tag:string;


}
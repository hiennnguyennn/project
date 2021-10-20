import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsInt, IsOptional } from "class-validator";

export class PaginationDto{
    @ApiProperty()
    @IsInt()
    @Type(()=>Number)
    @IsOptional()
    readonly page:number;

    @ApiProperty()
    @IsInt()
    @Type(()=>Number)
    @IsOptional()
    limit:number;
};
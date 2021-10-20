
import { ApiProperty } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import { IsDate, IsDateString, IsEnum, IsOptional } from "class-validator";
import { field } from "../../../common/constants/enum/search.SortBy.enum";
import { sortTy } from "../../../common/constants/enum/search.SortTy.enum";
import { PaginationDto } from "./pagination.dto";

export class SearchDto extends PaginationDto{
   @ApiProperty({type:String,required:false})
   @IsOptional()
   readonly value:string;

   @ApiProperty({enum:sortTy})
   @IsEnum(sortTy)
   readonly sortTy:sortTy;

   @ApiProperty({enum:field})
   @IsEnum(field)
   readonly sortBy:field;

   @ApiProperty({type:Date,description:'format yyyy-mm-ddThh:mm:ssZ',required:false})
   @IsOptional()
   @IsDate()
   @Type(()=>Date)
   
   readonly fromDate:Date;

   @ApiProperty({type:Date,description:'format yyyy-mm-ddThh:mm:ssZ',required:false})
   @IsOptional()
   @IsDate()
   @Type(()=>Date)
   
   readonly toDate:Date;
};
import { applyDecorators, SetMetadata, UseGuards } from "@nestjs/common";
import { ApiUnauthorizedResponse } from "@nestjs/swagger";
import { JwtAuthGuard } from "../../auth/guard/jwt-auth.guard";
import { RolesGuard } from "../../auth/roles/roles.guard";



export function Auth(role:string){
    return applyDecorators(
        UseGuards(JwtAuthGuard,RolesGuard),
        SetMetadata('role',role),
        ApiUnauthorizedResponse({ description: 'Unauthorized' }),
    );
};
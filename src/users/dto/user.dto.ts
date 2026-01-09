import { IsString, IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';      

export class ResetPasswordDto {
    @ApiProperty({ example: 'StrongPassword123!' })
    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    currentPassword: string;

   @ApiProperty({ example: 'StrongPassword123!' })
    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    newPassword: string;

}

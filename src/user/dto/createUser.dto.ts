import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ type: String, required: true })
  @IsString()
  @IsNotEmpty()
  fullname?: string;

  @ApiProperty({
    type: String,
    isArray: true,
    required: false,
  })
  @IsString({ each: true })
  friendsId?: string[];
}

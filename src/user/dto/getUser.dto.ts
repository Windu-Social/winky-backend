import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class GetUserProfileDto {
  @ApiProperty({ type: String, required: false })
  @IsString()
  @IsNotEmpty()
  readonly fullname: string;
}

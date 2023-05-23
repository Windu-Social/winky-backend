import { ApiProperty } from '@nestjs/swagger';

export class UpVoteOrDownVoteDto {
  @ApiProperty({ type: String, default: 'vote' })
  type: string;
}

import { ApiProperty } from '@nestjs/swagger';

export class CreateCommentDto {
  @ApiProperty({ type: String, required: true })
  postId: string;

  @ApiProperty({ type: String, required: true })
  content: string;
}

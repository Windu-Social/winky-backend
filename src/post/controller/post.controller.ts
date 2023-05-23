import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { PostService } from '../services/post.service';
import { UserAuthGuard } from 'src/guard/index.guard';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreatePostDto } from '../dto/create-post.dto';
import { IPagination } from 'src/types/common';
import { Request } from 'express';
import { UpVoteOrDownVoteDto } from '../dto/upvote-downvote.dto';
import { CreateCommentDto } from '../dto/create-comment.dto';
import { Post as PostModel } from '../models/post.model';
import { Comment } from '../models/comment.model';

@ApiBearerAuth()
@ApiTags('Post')
@Controller('post')
export class PostController {
  constructor(@Inject(PostService) private readonly postService: PostService) {}

  @Get()
  // @UseGuards(UserAuthGuard)
  async getAll(@Query() queries: IPagination) {
    return this.postService.findAll(queries);
  }

  @Post()
  @UseGuards(UserAuthGuard)
  async create(@Req() request: Request, @Body() payload: CreatePostDto) {
    return this.postService.create(payload, request['user']._id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update vote and down vote a Post' })
  @ApiBody({
    description:
      'Contains type of request (vote / unVote / downVote / unDownVote)',
    type: UpVoteOrDownVoteDto,
  })
  @UseGuards(UserAuthGuard)
  async voteOrDownVote(
    @Req() request: Request,
    @Param('id') id: string,
    @Body() payload: UpVoteOrDownVoteDto,
  ) {
    return this.postService.upvoteOrDownVote(payload, id, request['user']._id);
  }

  @Post('/comment')
  @ApiBody({
    type: PostModel,
  })
  @UseGuards(UserAuthGuard)
  async createComment(
    @Body() payload: CreateCommentDto,
    @Req() request: Request,
  ) {
    return this.postService.createComment(payload, request['user']._id);
  }

  @Put('/comment/vote/:id')
  @UseGuards(UserAuthGuard)
  @ApiBody({
    type: Comment,
  })
  async commentVote(
    @Body() payload: UpVoteOrDownVoteDto,
    @Param('id') id: string,
    @Req() request: Request,
  ) {
    return this.postService.commentVote(payload, id, request['user']._id);
  }
}

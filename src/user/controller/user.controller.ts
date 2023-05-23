import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserAuthGuard } from 'src/guard/index.guard';
import { UserService } from '../services/user.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { CreateUserDto } from '../dto/createUser.dto';
import { Request } from 'express';

@ApiBearerAuth()
@Controller('profile')
@ApiTags('Profile')
export class UserController {
  constructor(private readonly userServices: UserService) {}

  @ApiOperation({ summary: 'Create profile' })
  @ApiBody({ type: CreateUserDto })
  @UseGuards(UserAuthGuard)
  @Post()
  async createProfile(@Req() request: Request, @Body() body: CreateUserDto) {
    return await this.userServices.create(request, body);
  }

  @ApiOperation({ summary: 'Update profile' })
  @UseGuards(UserAuthGuard)
  @Post('update')
  async updateProfile(@Req() request: Request, @Body() body: CreateUserDto) {
    return await this.userServices.update(request, body);
  }

  @ApiOperation({ summary: 'Get profile' })
  @UseGuards(UserAuthGuard)
  @Get()
  async getProfile(@Req() req: any) {
    const authId = req.user._id;
    return await this.userServices.findOne(authId);
  }

  @ApiQuery({
    required: false,
    description: 'Fullname of friends',
    name: 'fullname',
  })
  @ApiOperation({ summary: 'Get profile of friends' })
  @UseGuards(UserAuthGuard)
  @Get('friends')
  async getFriendsProfile(
    @Req() request: any,
    @Query('fullname') fullname: string | undefined,
  ) {
    const userId = request.user._id;
    return await this.userServices.findAllByName(userId, fullname);
  }

  @ApiQuery({
    required: false,
    description: 'Room name',
    name: 'roomName',
  })
  @ApiOperation({ summary: 'Get chat video token' })
  @UseGuards(UserAuthGuard)
  @Get('video-token')
  async getVideoToken(@Req() req: any, @Query('roomName') roomName: string) {
    const authId = req.user.username;
    return await this.userServices.getRoomToken(authId, roomName);
  }
}

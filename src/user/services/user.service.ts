import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../models/user.entity';
import { InjectHTTPExceptions } from 'src/decorators/try-catch';
import { userErrors } from '../errors/user.error';
import { CreateUserDto } from '../dto/createUser.dto';
import { Model } from 'mongoose';
import { getVideoToken } from 'src/utils/index.utils';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  @InjectHTTPExceptions(
    userErrors.INTERNAL_SERVER_ERROR,
    HttpStatus.INTERNAL_SERVER_ERROR,
  )
  async create(request: any, payload: CreateUserDto) {
    const { fullname, friendsId } = payload;
    const authId = request.user._id;

    const existedUser = await this.userModel.findOne({ authId }).exec();
    if (existedUser) {
      throw new HttpException(userErrors.USER_EXISTED, HttpStatus.BAD_REQUEST);
    }
    const user: UserDocument = await this.userModel.create({
      fullname,
      friendsId,
      authId,
    });
    return user;
  }

  @InjectHTTPExceptions(
    userErrors.INTERNAL_SERVER_ERROR,
    HttpStatus.INTERNAL_SERVER_ERROR,
  )
  async update(request: any, payload: CreateUserDto) {
    const { fullname, friendsId } = payload;
    const authId = request.user._id;

    const existedUser = await this.userModel.findOne({ authId }).exec();
    if (!existedUser) {
      throw new HttpException(
        userErrors.USER_NOT_FOUND,
        HttpStatus.BAD_REQUEST,
      );
    }

    const newUserProfile = await this.userModel
      .updateOne(
        { authId },
        {
          fullname,
          friendsId,
        },
      )
      .exec();

    return { ...newUserProfile };
  }

  @InjectHTTPExceptions(
    userErrors.INTERNAL_SERVER_ERROR,
    HttpStatus.INTERNAL_SERVER_ERROR,
  )
  async findOne(authId: string) {
    const user: UserDocument = await this.userModel
      .findOne({
        authId,
      })
      .exec();
    if (!user) {
      throw new HttpException(
        userErrors.USER_NOT_FOUND,
        HttpStatus.BAD_REQUEST,
      );
    }
    return user;
  }

  @InjectHTTPExceptions(
    userErrors.INTERNAL_SERVER_ERROR,
    HttpStatus.INTERNAL_SERVER_ERROR,
  )
  async findAllByName(fullname: string | undefined) {
    const users: UserDocument[] = await this.userModel
      .find(
        fullname && {
          fullname: { $regex: fullname },
        },
      )
      .exec();
    return users;
  }

  @InjectHTTPExceptions(
    userErrors.INTERNAL_SERVER_ERROR,
    HttpStatus.INTERNAL_SERVER_ERROR,
  )
  async findAll() {
    const users: UserDocument[] = await this.userModel.find().exec();
    return users;
  }

  @InjectHTTPExceptions(
    userErrors.INTERNAL_SERVER_ERROR,
    HttpStatus.INTERNAL_SERVER_ERROR,
  )
  async getRoomToken(username: string, room: string): Promise<string> {
    const token = getVideoToken(room, username);
    return token.toJwt();
  }
}

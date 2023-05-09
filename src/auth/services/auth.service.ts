import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { InjectHTTPExceptions } from '../../decorators/try-catch';

import { Auth } from '../models/auth.model';
import { LoginDto, RegisterDto } from '../dto/auth.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AuthError } from '../errors/auth.error';
import { JwtService } from '@nestjs/jwt';
import { LoginResponse } from '../types';

import {
  ConfidentLevel,
  compareHashUtils,
  hashUtils,
} from '../utils/hash.utils';

import { getVideoToken } from 'src/utils/index.utils';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Auth.name) private authModel: Model<Auth>,
    private jwtService: JwtService,
  ) {}

  @InjectHTTPExceptions(
    AuthError.INTERNAL_SERVER_ERROR,
    HttpStatus.INTERNAL_SERVER_ERROR,
  )
  async login({ username, password }: LoginDto): Promise<LoginResponse> {
    const user = await this.authModel
      .findOne({
        username,
      })
      .exec();
    if (!user) {
      throw new HttpException(AuthError.USER_NOT_FOUND, HttpStatus.BAD_REQUEST);
    }

    const isMatch = await compareHashUtils(password, user.password);

    if (!isMatch) {
      throw new HttpException(AuthError.WRONG_PASSWORD, HttpStatus.BAD_REQUEST);
    }

    const token = await this.jwtService.signAsync({
      user,
    });
    return { user, token };
  }

  @InjectHTTPExceptions(
    AuthError.INTERNAL_SERVER_ERROR,
    HttpStatus.INTERNAL_SERVER_ERROR,
  )
  async register({
    username,
    password,
    email,
  }: RegisterDto): Promise<LoginResponse> {
    const existUser = await this.authModel.findOne({ username, email }).exec();

    if (existUser) {
      throw new HttpException(
        AuthError.USER_ALREADY_EXIST,
        HttpStatus.BAD_REQUEST,
      );
    }

    if (password.length < 8) {
      throw new HttpException(
        AuthError.PASSWORD_TOO_SHORT,
        HttpStatus.BAD_REQUEST,
      );
    }

    const encryptedPassword = await hashUtils(password, ConfidentLevel.HIGH);

    const newUser = new this.authModel({
      username,
      password: encryptedPassword,
      email,
    });

    const createdUser = await newUser.save();

    const token = await this.jwtService.signAsync({ user: createdUser });

    return { user: createdUser, token };
  }

  @InjectHTTPExceptions(
    AuthError.INTERNAL_SERVER_ERROR,
    HttpStatus.INTERNAL_SERVER_ERROR,
  )
  async getRoomToken(username: string, room: string): Promise<string> {
    const token = getVideoToken(room, username);
    return token.toJwt();
  }

  /**
   * @waning This method is only for testing purpose
   * @param username Username of the user
   * @returns Auth
   */
  @InjectHTTPExceptions(AuthError.INTERNAL_SERVER_ERROR, HttpStatus.BAD_REQUEST)
  async physicalDeleteUser(username: string): Promise<Auth> {
    if (username) {
      return await this.authModel.findOneAndDelete({ username });
    }
    throw new HttpException(AuthError.USER_NOT_FOUND, HttpStatus.BAD_REQUEST);
  }
}

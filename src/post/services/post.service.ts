import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, UpdateQuery } from 'mongoose';
import { Post } from '../models/post.model';
import { CreatePostDto } from '../dto/create-post.dto';
import { InjectHTTPExceptions } from 'src/decorators/try-catch';
import { postError } from '../errors/post.errors';
import { IPagination, IPaginationResponse } from 'src/types/common';
import { UpVoteOrDownVoteDto } from '../dto/upvote-downvote.dto';
import { UpdateOptions } from '../types';
import { CreateCommentDto } from '../dto/create-comment.dto';
import { Comment } from '../models/comment.model';

@Injectable()
export class PostService {
  constructor(
    @InjectModel(Post.name) private readonly postModel: Model<Post>,
    @InjectModel(Comment.name) private readonly commentModel: Model<Comment>,
  ) {}

  @InjectHTTPExceptions(
    postError.INTERNAL_SERVER_ERROR,
    HttpStatus.INTERNAL_SERVER_ERROR,
  )
  async create(payload: CreatePostDto, authorId: string) {
    const newPost = await this.postModel.create({
      ...payload,
      author: authorId,
    });
    return newPost;
  }

  @InjectHTTPExceptions(
    postError.INTERNAL_SERVER_ERROR,
    HttpStatus.INTERNAL_SERVER_ERROR,
  )
  async findAll(queries: IPagination): Promise<IPaginationResponse> {
    const { limit = 10, page = 1, search = '' } = queries;
    const posts = await this.postModel
      .find({
        title: { $regex: search },
      })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate({
        path: 'author',
        model: 'Auth',
        select: ['username', 'id'],
        populate: {
          path: 'user',
          model: 'User',
        },
      })
      .populate({
        path: 'comments',
        model: 'Comment',
        populate: {
          path: 'author',
          model: 'Auth',
          select: ['username', 'email', 'user'],
          populate: {
            path: 'user',
            model: 'User',
          },
        },
      })
      .sort({ createdAt: -1 })
      .lean()
      .exec();

    const total = await this.postModel.countDocuments();

    return {
      data: posts,
      meta: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
      },
    };
  }

  @InjectHTTPExceptions(
    postError.INTERNAL_SERVER_ERROR,
    HttpStatus.INTERNAL_SERVER_ERROR,
  )
  async upvoteOrDownVote(
    payload: UpVoteOrDownVoteDto,
    postId: string,
    userId: string,
  ) {
    const updateOptions = (): UpdateQuery<Post> => {
      const options: UpdateOptions = {
        $push: {},
        $pull: {},
      };
      if (payload.type === 'vote') {
        options['$push'].upVoters = userId;
        options['$pull'].downVoters = userId;
      }
      if (payload.type === 'unVote') {
        options['$pull'].upVoters = userId;
        options['$pull'].downVoters = userId;
      }
      if (payload.type === 'downVote') {
        options['$push'].downVoters = userId;
        options['$pull'].upVoters = userId;
      }
      return options;
    };

    const post = await this.postModel.findByIdAndUpdate(
      postId,
      updateOptions(),
    );

    return post;
  }

  @InjectHTTPExceptions(
    postError.INTERNAL_SERVER_ERROR,
    HttpStatus.INTERNAL_SERVER_ERROR,
  )
  async createComment(payload: CreateCommentDto, userId: string) {
    const comment = await this.commentModel.create({
      ...payload,
      author: userId,
    });

    await this.postModel.findByIdAndUpdate(payload.postId, {
      $push: { comments: comment.id },
    });

    const returnComment = await this.commentModel
      .findOne({ postId: payload.postId, _id: comment._id })
      .populate({
        path: 'author',
        model: 'Auth',
        select: ['username', 'id'],
        populate: {
          path: 'user',
          model: 'User',
        },
      })
      .lean()
      .exec();

    return returnComment;
  }

  async commentVote(
    payload: UpVoteOrDownVoteDto,
    commentId: string,
    userId: string,
  ) {
    const updateOptions = (): UpdateQuery<Post> => {
      const options: UpdateOptions = {
        $push: {},
        $pull: {},
      };
      if (payload.type === 'vote') {
        options['$push'].upVoters = userId;
        options['$pull'].downVoters = userId;
      }
      if (payload.type === 'unVote') {
        options['$pull'].upVoters = userId;
        options['$pull'].downVoters = userId;
      }
      if (payload.type === 'downVote') {
        options['$push'].downVoters = userId;
        options['$pull'].upVoters = userId;
      }
      return options;
    };

    const comment = await this.commentModel.findOneAndUpdate(
      { _id: commentId },
      updateOptions(),
    );

    return comment;
  }
}

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseShema, now } from 'mongoose';
import { Auth } from 'src/auth/models/auth.model';

export type CommentDocument = HydratedDocument<Comment>;

@Schema({ timestamps: true })
export class Comment {
  @Prop({ type: MongooseShema.Types.ObjectId, ref: 'Auth', required: true })
  author: Auth;

  @Prop({ type: String, required: true })
  content: string;

  @Prop({ type: String, required: true })
  postId: string;

  @Prop([{ type: MongooseShema.Types.ObjectId, required: false, ref: 'Auth' }])
  upVoters: Auth[];

  @Prop([{ type: MongooseShema.Types.ObjectId, required: false, ref: 'Auth' }])
  downVoters: Auth[];

  @Prop([
    { type: MongooseShema.Types.ObjectId, required: false, ref: 'Comment' },
  ])
  replies: Comment[];

  @Prop({ type: MongooseShema.Types.ObjectId, required: false, ref: 'Comment' })
  parentComment: Comment;

  @Prop({ type: Date, default: now })
  createdAt: Date;

  @Prop({ type: Date, default: now })
  updatedAt: Date;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as MongooseSchema } from 'mongoose';
import { now } from 'mongoose';
import { Auth } from 'src/auth/models/auth.model';

@Schema({ timestamps: true })
export class Post {
  @Prop({ type: String, minlength: 1 })
  title: string;

  @Prop({ type: String, required: true })
  content: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Auth', required: true })
  author: Auth;

  @Prop([{ type: MongooseSchema.Types.ObjectId, ref: 'Auth', required: false }])
  upVoters: Auth[];

  @Prop([{ type: MongooseSchema.Types.ObjectId, ref: 'Auth', required: false }])
  downVoters: Auth[];

  @Prop({ type: String, required: false })
  file: string;

  @Prop([{ type: String, required: false, default: 'public' }])
  publishMode: string;

  @Prop([
    {
      type: MongooseSchema.Types.ObjectId,
      ref: 'Comment',
      required: false,
    },
  ])
  comments: Comment[];

  @Prop({ default: now() })
  createdAt: Date;

  @Prop({ default: now() })
  updatedAt: Date;
}

export const PostSchema = SchemaFactory.createForClass(Post);

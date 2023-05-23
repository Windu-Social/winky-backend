import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types, Schema as MongooseShema } from 'mongoose';
import { Auth } from 'src/auth/models/auth.model';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop({ required: true, unique: true })
  authId: Types.ObjectId;

  @Prop({ type: MongooseShema.Types.ObjectId, ref: 'Auth' })
  auth: Auth;

  @Prop({ type: String, required: true })
  fullname: string;

  @Prop({ type: String, required: false })
  avatarUrl: string;

  @Prop({ type: [String], required: true })
  friendsId: string[];
}

export const UserSchema = SchemaFactory.createForClass(User);

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Auth } from './auth.model';

export type SaltDocument = mongoose.HydratedDocument<Salt>;

@Schema()
export class Salt {
  @Prop({ type: String, required: true, unique: true })
  salt: string;
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Auth' })
  auth: Auth;
}

export const SaltSchema = SchemaFactory.createForClass(Salt);

import { Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { Message, MessageDocument } from './model/message.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class MessagesService {
  messages: Message[] = [];
  _clientToUser: Map<string, string> = new Map();

  constructor(
    @InjectModel(Message.name)
    private messageModel: Model<Message>,
  ) {}

  identify(userId: string, clientId: string) {
    this._clientToUser.set(userId, clientId);
    // eslint-disable-next-line no-console
    console.log(
      '🚀 ~ file: messages.service.ts:10 ~ MessagesService ~ _clientToUser:',
      this._clientToUser,
    );

    return this._clientToUser;
  }

  leave(userId: string) {
    this._clientToUser.delete(userId);
  }

  findUserSocketId(userId: string) {
    return this._clientToUser.get(userId);
  }

  async create(createMessageDto: CreateMessageDto) {
    const message = { ...createMessageDto };

    const newMessage = new this.messageModel({
      paticipants: [message.senderId, message.receiverId],
      content: message.text,
      receiverId: message.receiverId,
      senderId: message.senderId,
      text: message.text,
    });

    const processedMessage = await newMessage.save();

    const formattedMessage: Message = {
      paticipants: processedMessage.paticipants,
      text: processedMessage.text,
      receiverId: processedMessage.receiverId,
      senderId: processedMessage.senderId,
      room: '',
      isRead: processedMessage.isRead,
      createdAt: processedMessage.createdAt,
      updatedAt: processedMessage.updatedAt,
    };

    this.messages.push(formattedMessage);

    return { ...formattedMessage };
  }

  async findAll(paticipants: string[]) {
    console.log(
      '🚀 ~ file: messages.service.ts:67 ~ MessagesService ~ findAll ~ paticipants:',
      paticipants,
    );

    const historyMessage = await this.messageModel
      .find({
        paticipants: { $all: [...paticipants] },
      })
      .lean()
      .exec();

    const messageHistory: Message[] = [];

    historyMessage.forEach((message) => {
      messageHistory.push({
        ...message,
        paticipants: message.paticipants,
        text: message.text,
        receiverId: message.receiverId,
        senderId: message.senderId,
      });
    });

    return messageHistory;
  }

  findOne(id: number) {
    return `This action returns a #${id} message`;
  }

  update(id: number, updateMessageDto: UpdateMessageDto) {
    return `This action updates a #${id} message`;
  }

  async markAsRead(readerId: string) {
    return this.messageModel.updateMany(
      {
        receiverId: readerId,
      },
      {
        isRead: true,
      },
    );
  }

  remove(id: number) {
    return `This action removes a #${id} message`;
  }

  findUsersOnline(usersId: string[]) {
    return usersId.filter((userId) => this._clientToUser.has(userId));
  }
}

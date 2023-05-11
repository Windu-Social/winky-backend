import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
} from '@nestjs/websockets';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { Server, Socket } from 'socket.io';
import { FindAllMessagesDto } from './dto/find-message.dto';

@WebSocketGateway(8080, { namespace: 'messages', cors: true })
export class MessagesGateway {
  @WebSocketServer()
  private server: Server;

  constructor(private readonly messagesService: MessagesService) {}

  @SubscribeMessage('message')
  async create(@MessageBody() createMessageDto: CreateMessageDto) {
    const { receiverId, senderId } = createMessageDto;
    const receiverSocketId = this.messagesService.findUserSocketId(receiverId);
    const senderSocketId = this.messagesService.findUserSocketId(senderId);

    const message = await this.messagesService.create(createMessageDto);

    if (!receiverSocketId) {
      // this.server.to(senderSocketId).emit('message', {
      //   ...createMessageDto,
      //   text: messagesErrors.USER_NOT_ONLINE,
      //   sentTime: new Date(),
      //   isSuccess: false,
      // });

      this.server.to(senderSocketId).emit('message', {
        ...message,
        sentTime: message.createdAt,
        isSuccess: true,
      });
      return;
    }

    this.server
      .to(senderSocketId)
      .emit('message', { ...message, sentTime: new Date(), isSuccess: true });
    this.server
      .to(receiverSocketId)
      .emit('message', { ...message, sentTime: new Date(), isSuccess: true });
    return message;
  }

  @SubscribeMessage('findAllMessages')
  async findAll(@MessageBody() findParams: FindAllMessagesDto) {
    const { senderId, receiverId } = findParams;
    const receiverSocketId = this.messagesService.findUserSocketId(receiverId);
    const senderSocketId = this.messagesService.findUserSocketId(senderId);

    const messages = await this.messagesService.findAll([senderId, receiverId]);

    const formattedMessageResponses = messages.map((message) => {
      return {
        ...message,
        sentTime: message.createdAt,
        isSuccess: true,
      };
    });

    this.server.to(senderSocketId).emit('message', formattedMessageResponses);
    this.server.to(receiverSocketId).emit('message', formattedMessageResponses);
    return messages;
  }

  @SubscribeMessage('findOneMessage')
  findOne(@MessageBody() id: number) {
    return this.messagesService.findOne(id);
  }

  @SubscribeMessage('updateMessage')
  update(@MessageBody() updateMessageDto: UpdateMessageDto) {
    return this.messagesService.update(updateMessageDto.id, updateMessageDto);
  }

  @SubscribeMessage('removeMessage')
  remove(@MessageBody() id: number) {
    return this.messagesService.remove(id);
  }

  @SubscribeMessage('join')
  async join(
    @MessageBody('uid') userId: string,
    @ConnectedSocket() client: Socket,
  ) {
    return this.messagesService.identify(userId, client.id);
  }

  @SubscribeMessage('leave')
  leave(@MessageBody('uid') userId: string, @ConnectedSocket() client: Socket) {
    this.messagesService.identify(userId, client.id);
  }

  @SubscribeMessage('typing')
  typing(
    @MessageBody('isTyping') isTyping: boolean,
    @ConnectedSocket() client: Socket,
  ) {
    //TODO: typing
  }

  @SubscribeMessage('online')
  online(@MessageBody('usersId') usersId: string[]) {
    return this.messagesService.findUsersOnline(usersId);
  }
}

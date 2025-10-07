import { TokenResponse } from './auth.interface';
import {
   ChatWsMessageBase,
   ChatWsUnreadMessage,
   ChatWsNewMessage,
   ChatWsError,
   ChatWsSendMessage,
   ChatWsMessage
} from './chat-ws-message.interface';
import {
   ChatConnectionWsParams,
   ChatWsService,
} from './chats-ws-service.interface';
import { Chat, Message, LastMessageRes } from './chats.interface';
import { Pageable } from './pageable.interface';
import { PostCreateDto, Post, PostComment, CommentCreateDto } from './post.interface';
import { Profile } from './profile.interface';

export {
   TokenResponse,
   Chat,
   Message,
   LastMessageRes,
   Pageable,
   Profile,
   PostCreateDto,
   Post,
   PostComment,
   CommentCreateDto,
   ChatConnectionWsParams,
   ChatWsService,
   ChatWsMessageBase,
   ChatWsUnreadMessage,
   ChatWsNewMessage,
   ChatWsError,
   ChatWsSendMessage,
   ChatWsMessage
}

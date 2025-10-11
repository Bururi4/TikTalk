import {
   ChatWsError,
   ChatWsMessage,
   ChatWsMessageBase,
   ChatWsNewMessage,
   ChatWsSendMessage,
   ChatWsUnreadMessage,
} from './chat-ws-message.interface';
import {
   ChatConnectionWsParams,
   ChatWsService,
} from './chats-ws-service.interface';
import { Chat, LastMessageRes, Message } from './chats.interface';
import { isChatError, isUnreadMessage, isNewMessage } from './type-guard';

export {
   isUnreadMessage,
   isNewMessage,
   isChatError,
   ChatConnectionWsParams,
   ChatWsService,
   Chat,
   Message,
   LastMessageRes,
   ChatWsMessageBase,
   ChatWsUnreadMessage,
   ChatWsNewMessage,
   ChatWsError,
   ChatWsSendMessage,
   ChatWsMessage,
};

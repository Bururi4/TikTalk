import {
   ChatWsError,
   ChatWsMessage,
   ChatWsNewMessage,
   ChatWsUnreadMessage,
} from './chat-ws-message.interface';

export function isUnreadMessage(
   message: ChatWsMessage
): message is ChatWsUnreadMessage {
   return 'action' in message && message.action === 'unread';
}

export function isNewMessage(
   message: ChatWsMessage
): message is ChatWsNewMessage {
   return 'action' in message && message.action === 'message';
}

export function isChatError(message: ChatWsMessage): message is ChatWsError {
   return (
      'status' in message && message.status === 'error' && 'message' in message
   );
}

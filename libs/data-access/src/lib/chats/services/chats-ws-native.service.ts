import {
   ChatConnectionWsParams,
   ChatWsService,
} from '../interfaces/chats-ws-service.interface';

export class ChatsWsNativeService implements ChatWsService {
   #socket: WebSocket | null = null;

   connect(params: ChatConnectionWsParams) {
      if (this.#socket) return;

      this.#socket = new WebSocket(params.url, [params.token]);

      this.#socket.onmessage = (event: MessageEvent) => {
         params.handleMessage(JSON.parse(event.data));
      };

      this.#socket.onclose = () => {
         console.log('А чё это вы тут делаете? Кино - то давно уже кончилось!');
      };
   }

   sendMessage(text: string, chatId: number) {
      this.#socket?.send(
         JSON.stringify({
            text,
            chat_id: chatId,
         })
      );
   }

   disconnect() {
      this.#socket?.close();
   }
}

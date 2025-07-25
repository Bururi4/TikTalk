import { Route } from '@angular/router';
import { ChatsPageComponent, ChatWorkspaceComponent } from '@tt/chats';

export const chatsRoutes: Route[] = [
   {
      path: '',
      component: ChatsPageComponent,
      children: [{ path: ':id', component: ChatWorkspaceComponent }],
   },
];

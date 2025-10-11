import { Route } from '@angular/router';
import { ChatsPageComponent, ChatWorkspaceComponent } from '../index';

export const chatsRoutes: Route[] = [
   {
      path: '',
      component: ChatsPageComponent,
      children: [{ path: ':id', component: ChatWorkspaceComponent }],
   },
];

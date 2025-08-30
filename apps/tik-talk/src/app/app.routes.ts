import { Routes } from '@angular/router';
import { canActivateAuth, LoginPageComponent } from '@tt/auth';
import {
   ProfileEffects,
   profileFeature,
   ProfilePageComponent,
   SearchPageComponent,
   SettingsPageComponent,
} from '@tt/profile';
import { chatsRoutes } from '@tt/chats';
import { LayoutComponent } from '@tt/layout';
import { provideState } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { PostEffects, postFeature } from '@tt/posts';

export const routes: Routes = [
   {
      path: '',
      component: LayoutComponent,
      canActivate: [canActivateAuth],
      providers: [provideState(profileFeature), provideEffects(ProfileEffects)],
      children: [
         { path: '', redirectTo: 'profile/me', pathMatch: 'full' },
         {
            path: 'profile/:id',
            component: ProfilePageComponent,
            providers: [provideState(postFeature), provideEffects(PostEffects)],
         },
         { path: 'settings', component: SettingsPageComponent },
         { path: 'search', component: SearchPageComponent },
         { path: 'chats', loadChildren: () => chatsRoutes },
      ],
   },
   { path: 'login', component: LoginPageComponent },
];

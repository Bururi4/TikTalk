import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
   selector: 'app-layout',
   standalone: true,
   imports: [SidebarComponent, RouterOutlet],
   templateUrl: './layout.component.html',
   styleUrl: './layout.component.scss',
})
export class LayoutComponent {}

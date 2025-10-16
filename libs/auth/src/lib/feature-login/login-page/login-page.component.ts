import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import {
   FormControl,
   FormGroup,
   ReactiveFormsModule,
   Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@tt/data-access';

@Component({
   selector: 'app-login-page',
   standalone: true,
   imports: [ReactiveFormsModule],
   templateUrl: './login-page.component.html',
   styleUrl: './login-page.component.scss',
   changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginPageComponent {
   form = new FormGroup({
      username: new FormControl<string | null>('', Validators.required),
      password: new FormControl<string | null>('', Validators.required),
   });

   constructor(private authService: AuthService, private router: Router) {}

   onSubmit() {
      if (this.form.valid) {
         //@ts-ignore
         this.authService.login(this.form.value).subscribe((res) => {
            this.router.navigate(['']);
         });
      }
   }

   showPassword = signal<boolean>(false);
}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { CallbackComponent } from '@app/auth/callback/callback.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [CallbackComponent],
  exports: [CallbackComponent],
  providers: [AuthService, AuthGuard]
})
export class AuthModule { }

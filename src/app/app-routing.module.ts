import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { CallbackComponent } from '@app/auth/callback/callback.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'auth/callback', component: CallbackComponent },
  { path: 'directory', loadChildren: './directory/directory.module#DirectoryModule' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

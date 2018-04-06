import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DirectoryComponent } from './directory.component';
import { EditProfilePageComponent } from './components/edit-profile-page/edit-profile-page.component';
import { AuthGuard } from '@app/auth/auth.guard';

const routes: Routes = [
    { path: '', component: DirectoryComponent },
    { path: 'profile/edit', component: EditProfilePageComponent,  canActivate: [AuthGuard] },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DirectoryRoutingModule { }

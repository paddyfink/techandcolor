import { NgModule } from '@angular/core';
import { EditProfilePageComponent } from './components/edit-profile-page/edit-profile-page.component';
import { ProfileCardComponent } from './components/profile-card/profile-card.component';
import { ProfileslistComponent } from './components/profiles-list/profiles-list.component';
import { SharedModule } from '@app/shared/shared.module';
import { DirectoryComponent } from './directory.component';
import { DirectoryRoutingModule } from './directory-routing.module';

@NgModule({
  imports: [
    SharedModule,
    DirectoryRoutingModule
  ],
  declarations: [
    ProfileslistComponent,
    ProfileCardComponent,
    EditProfilePageComponent,
    DirectoryComponent,
  ]
})
export class DirectoryModule { }

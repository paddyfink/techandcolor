import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularFirestore } from 'angularfire2/firestore';
import { NotificationsComponent } from './notifications/notifications.component';
import { NotificationsService } from './notifications/notifications.service';
import { GrowlModule } from 'primeng/growl';
import { AngularFireAuth } from 'angularfire2/auth';

@NgModule({
  imports: [
    CommonModule,
    GrowlModule
  ],
  exports: [ NotificationsComponent],
  declarations: [NotificationsComponent],
  providers: [AngularFireAuth, AngularFirestore, NotificationsService]
})
export class CoreModule { }

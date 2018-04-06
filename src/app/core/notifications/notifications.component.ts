import { Component, OnInit, OnDestroy } from '@angular/core';
import { Message } from 'primeng/primeng';
import { Subscription } from 'rxjs/Subscription';
import { NotificationsService } from '@app/core/notifications/notifications.service';

@Component({
  selector: 'app-notifications',
  template: `<p-growl [(value)]="msgs"></p-growl>`,
  styles: []
})
export class NotificationsComponent implements OnInit, OnDestroy {

  msgs: Message[] = [];
  subscription: Subscription;

  constructor(private notificationsService: NotificationsService) { }

  ngOnInit() {
    this.subscribeToNotifications();
  }

  subscribeToNotifications() {
    this.subscription = this.notificationsService.notificationChange
      .subscribe(notification => {
        this.msgs = [];
        this.msgs.push(notification);
      });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService, Toast } from '../../../core/services/notification.service';

@Component({
    selector: 'app-toast-notification',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './toast-notification.component.html',
    styleUrls: ['./toast-notification.component.css']
})
export class ToastNotificationComponent {
    constructor(public notificationService: NotificationService) { }

    removeToast(id: number) {
        this.notificationService.remove(id);
    }
}

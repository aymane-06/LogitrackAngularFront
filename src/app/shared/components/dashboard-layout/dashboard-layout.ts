import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-dashboard-layout',
  templateUrl: './dashboard-layout.html',
  styleUrls: ['./dashboard-layout.css'],
  standalone: false
})
export class DashboardLayout {
  @Input() title: string = '';
  @Input() subtitle: string = '';
}

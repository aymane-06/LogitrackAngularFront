import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-stats-card',
  templateUrl: './stats-card.html',
  styleUrls: ['./stats-card.css'],
  standalone: false
})
export class StatsCard {
  @Input() title: string = '';
  @Input() value: string | number = '';
  @Input() icon: string = '📊';
  @Input() color: 'blue' | 'green' | 'purple' | 'orange' | 'red' = 'blue';
  @Input() trend?: { value: number; isPositive: boolean };
}

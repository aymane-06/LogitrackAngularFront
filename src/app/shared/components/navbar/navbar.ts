import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css'],
  standalone: false
})
export class Navbar {
  @Input() title: string = 'Dashboard';
}

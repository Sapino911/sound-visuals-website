import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, MatButtonModule, MatCardModule, MatIconModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  protected readonly highlights = [
    { value: '12+', label: 'Years delivering premium event AV' },
    { value: '480', label: 'Corporate, live and private productions' },
    { value: '24/7', label: 'Technical support for show-critical events' }
  ];

  protected readonly services = [
    { icon: 'volume_up', title: 'Sound Systems', text: 'Clear, controlled audio for conferences, launches, concerts and broadcast-ready rooms.' },
    { icon: 'videocam', title: 'Visual Production', text: 'LED walls, projection, live camera switching, streaming and content playback.' },
    { icon: 'wb_incandescent', title: 'Lighting Design', text: 'Atmospheric and architectural lighting that supports brand, stage and guest experience.' }
  ];
}

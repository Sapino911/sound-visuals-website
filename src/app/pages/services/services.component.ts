import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [MatCardModule, MatChipsModule, MatIconModule],
  templateUrl: './services.component.html',
  styleUrl: './services.component.scss'
})
export class ServicesComponent {
  protected readonly services = [
    {
      icon: 'volume_up',
      title: 'Audio Engineering',
      text: 'PA systems, wireless microphones, monitor mixes, conference audio, recording and technical operators.',
      tags: ['Line array', 'RF planning', 'Mixing']
    },
    {
      icon: 'desktop_windows',
      title: 'Screens & Visuals',
      text: 'LED video walls, projection, content playback, presentation control, camera feeds and live switching.',
      tags: ['LED wall', 'Projection', 'Playback']
    },
    {
      icon: 'light_mode',
      title: 'Lighting Design',
      text: 'Stage washes, moving fixtures, ambience, architectural lighting and time-coded looks for reveals.',
      tags: ['Stage', 'Ambient', 'Reveal']
    },
    {
      icon: 'podium',
      title: 'Stage & Rigging',
      text: 'Modular staging, truss, draping, cable management, podiums and clean technical presentation.',
      tags: ['Staging', 'Truss', 'Drape']
    },
    {
      icon: 'settings_input_component',
      title: 'Hybrid Events',
      text: 'Streaming, remote speakers, recording, broadcast switching and audio feeds for online audiences.',
      tags: ['Streaming', 'Recording', 'Hybrid']
    },
    {
      icon: 'support_agent',
      title: 'Technical Management',
      text: 'Site surveys, technical drawings, crew scheduling, supplier coordination and show calling support.',
      tags: ['Planning', 'Crew', 'Show flow']
    }
  ];
}

import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-portfolio',
  standalone: true,
  imports: [MatCardModule, MatIconModule],
  templateUrl: './portfolio.component.html',
  styleUrl: './portfolio.component.scss'
})
export class PortfolioComponent {
  protected readonly projects = [
    { title: 'Executive Summit', type: 'Conference production', detail: 'Three-room audio, keynote LED wall, camera relay and hybrid stream.' },
    { title: 'Automotive Reveal', type: 'Product launch', detail: 'Lighting cue stack, surround audio, screen playback and reveal sequence.' },
    { title: 'Awards Gala', type: 'Premium live event', detail: 'Stage design, show calling, performance audio and IMAG screen support.' },
    { title: 'Brand Roadshow', type: 'Multi-city activation', detail: 'Repeatable AV package, crew logistics, playback and portable staging.' }
  ];
}

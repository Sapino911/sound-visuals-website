import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [MatCardModule, MatIconModule],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss'
})
export class AboutComponent {
  protected readonly values = [
    { icon: 'engineering', title: 'Technically exact', text: 'System design, cabling, power and signal flow are planned before the truck is loaded.' },
    { icon: 'groups', title: 'Crew-first culture', text: 'Experienced technicians, stage managers and operators who communicate calmly on show day.' },
    { icon: 'verified', title: 'Show ready', text: 'Redundancy, testing and disciplined cueing keep the focus on the audience experience.' }
  ];
}

import { Routes } from '@angular/router';
import { AboutComponent } from './pages/about/about.component';
import { ContactComponent } from './pages/contact/contact.component';
import { HomeComponent } from './pages/home/home.component';
import { PortfolioComponent } from './pages/portfolio/portfolio.component';
import { ServicesComponent } from './pages/services/services.component';

export const routes: Routes = [
  { path: '', component: HomeComponent, title: 'Sound & Visuals | Event AV Production' },
  { path: 'about', component: AboutComponent, title: 'About | Sound & Visuals' },
  { path: 'services', component: ServicesComponent, title: 'Services | Sound & Visuals' },
  { path: 'portfolio', component: PortfolioComponent, title: 'Portfolio | Sound & Visuals' },
  { path: 'contact', component: ContactComponent, title: 'Contact | Sound & Visuals' },
  { path: '**', redirectTo: '' }
];

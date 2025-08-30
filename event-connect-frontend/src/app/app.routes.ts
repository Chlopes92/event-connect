import { Routes } from '@angular/router';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { OrganizerHomePageComponent } from './pages/organizer-home-page/organizer-home-page.component';
import { EventFormPageComponent } from './pages/event-form-page/event-form-page.component';

export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', component: HomePageComponent, title: 'EventConnect - Home' },
    { path: 'organizer-home', component: OrganizerHomePageComponent, title: 'EventConnect - Home Organizer' },
    { path: 'create-event', component: EventFormPageComponent, title: 'EventConnect - Event Form'},
];

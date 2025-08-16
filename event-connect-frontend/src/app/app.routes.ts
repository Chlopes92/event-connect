import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { EventFormComponent } from './pages/event-form/event-form.component';
import { OrganizerHomeComponent } from './pages/organizer-home/organizer-home.component';

export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', component: HomeComponent, title: 'EventConnect - Home' },
    { path: 'organizer-home', component: OrganizerHomeComponent, title: 'EventConnect - Home Organizer' },
    { path: 'event-form', component: EventFormComponent, title: 'EventConnect - Event Form'},
];

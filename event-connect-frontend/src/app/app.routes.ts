import { Routes } from '@angular/router';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { OrganizerHomePageComponent } from './pages/organizer-home-page/organizer-home-page.component';
import { EventFormPageComponent } from './pages/event-form-page/event-form-page.component';
import { OrganizerSignupPageComponent } from './pages/organizer-signup-page/organizer-signup-page.component';
import { OrganizerLoginPageComponent } from './pages/organizer-login-page/organizer-login-page.component';
import { NotFoundPageComponent } from './pages/not-found-page/not-found-page.component';
import { EventDetailsPageComponent } from './pages/event-details-page/event-details-page.component';

export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', component: HomePageComponent, title: 'EventConnect - Home' },
    { path: 'organizer-dashboard', component: OrganizerHomePageComponent, title: 'EventConnect - Home Organizer' },
    { path: 'create-event', component: EventFormPageComponent, title: 'EventConnect - Event Form Create'},
    { path: 'edit-event/:id', component: EventFormPageComponent, title: 'EventConnect - Event Form Edit' },
    { path: 'organizer-signup', component: OrganizerSignupPageComponent, title: 'EventConnect - Organizer Signup' },
    { path: 'organizer-login', component: OrganizerLoginPageComponent, title: 'EventConnect - Organizer Login' },
    { path: 'event-details/:id', component: EventDetailsPageComponent, title: 'EventConnect - Event Details'},

    { path: '**', component: NotFoundPageComponent, title: 'EventConnect - Page Not Found' }
];

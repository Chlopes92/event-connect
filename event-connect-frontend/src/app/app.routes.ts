import { Routes } from '@angular/router';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { OrganizerHomePageComponent } from './pages/organizer-home-page/organizer-home-page.component';
import { EventFormPageComponent } from './pages/event-form-page/event-form-page.component';
import { OrganizerSignupPageComponent } from './pages/organizer-signup-page/organizer-signup-page.component';
import { NotFoundPageComponent } from './pages/not-found-page/not-found-page.component';
import { EventDetailsPageComponent } from './pages/event-details-page/event-details-page.component';
import { ClientSignupPageComponent } from './pages/client-signup-page/client-signup-page.component';
import { authGuard, organizerGuard } from './guards/auth.guard';

export const routes: Routes = [
    // Routes publiques (pas d'authentification requise)
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', component: HomePageComponent, title: 'EventConnect - Accueil' },
    { path: 'event-details/:id', component: EventDetailsPageComponent, title: 'EventConnect - Détails événement'},
    
    // Pages d'inscription/connexion (accessible uniquement si NON connecté)
    { path: 'organizer-signup', component: OrganizerSignupPageComponent, title: 'EventConnect - Organizer Signup' },
    { path: 'client-signup', component: ClientSignupPageComponent, title: 'EventConnect - Client Signup' },
    
    // Routes ORGANISATEUR (nécessite ROLE_ADMIN)
    { path: 'organizer-dashboard', component: OrganizerHomePageComponent, title: 'EventConnect - Home Organizer', canActivate: [organizerGuard] },
    { path: 'create-event', component: EventFormPageComponent, title: 'EventConnect - Event Form Create', canActivate: [organizerGuard] },
    { path: 'edit-event/:id', component: EventFormPageComponent, title: 'EventConnect - Event Form Edit', canActivate: [organizerGuard] },

     // Page 404 (toutes les autres routes)
    { path: '**', component: NotFoundPageComponent, title: 'EventConnect - Page Not Found' }
];

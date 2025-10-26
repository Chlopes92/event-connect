import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { EventCard, EVENTS_MOCK } from '../../../mocks/events.mock';

@Component({
  selector: 'app-list-event-created',
  imports: [CommonModule],
  templateUrl: './list-event-created.component.html',
  styleUrl: './list-event-created.component.css'
})
export class ListEventCreatedComponent {
  events: EventCard[] = EVENTS_MOCK; // utilisation du mock
  constructor(private router: Router) {}


  editEvent(eventId: number) {
    this.router.navigate(['/edit-event', eventId]); // Navigation vers le formulaire d'édition
  }

  deleteEvent(eventId: number) {
    console.log('Supprimer l\'événement:', eventId);
    this.events = this.events.filter(event => event.id !== eventId);
  }

  createNewEvent() {
    this.router.navigate(['/create-event']); // Navigation vers le formulaire de création
  }
}
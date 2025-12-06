import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { EventService } from '../../../services/event/event.service';
import { Event } from '../../../shared/models/Event';

@Component({
  selector: 'app-list-event-created',
  imports: [CommonModule],
  templateUrl: './list-event-created.component.html',
  styleUrl: './list-event-created.component.css'
})
export class ListEventCreatedComponent {
  events: Event[] = [];
  isLoading: boolean = true;
  errorMessage: string = '';

  private eventService = inject(EventService);
  private router = inject(Router);

  ngOnInit(): void {
    this.loadEvents();
  }

  loadEvents(): void {
    this.isLoading = true;
    this.errorMessage = '';
    
    this.eventService.getAllEvents().subscribe({
      next: (events: Event[]) => {
        this.events = events;
        this.isLoading = false;
        console.log('Événements chargés:', events);
      },
      error: (error: any) => {
        console.error('Erreur lors du chargement des événements:', error);
        this.errorMessage = 'Erreur lors du chargement des événements';
        this.isLoading = false;
      }
    });
  }

  editEvent(eventId?: number): void {
    if (!eventId) {
      console.error('ID événement manquant');
      return;
    }
    this.router.navigate(['/edit-event', eventId]);
  }

  deleteEvent(eventId?: number): void {
    if (!eventId) {
      console.error('ID événement manquant');
      return;
    }

    if (!confirm('Êtes-vous sûr de vouloir supprimer cet événement ?')) {
      return;
    }

    this.eventService.deleteEvent(eventId).subscribe({
      next: (response: any) => {
        console.log('Événement supprimé:', response);
        // Recharger la liste des événements
        this.loadEvents();
      },
      error: (error: any) => {
        console.error('Erreur lors de la suppression:', error);
        alert('Erreur lors de la suppression de l\'événement');
      }
    });
  }

  createNewEvent(): void {
    this.router.navigate(['/create-event']);
  }

  // Méthodes utilitaires pour le template
  getEventPrice(event: Event): string {
    if (!event.price || event.price === 0) {
      return 'Gratuit';
    }
    return `${event.price} €`;
  }

  getEventDate(event: Event): string {
    const date = new Date(event.dateEvent);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  }

  getEventImage(event: Event): string {
    return event.imgUrl || 'assets/images/default-event.jpg';
  }

  getCategoryName(event: Event): string {
    if (event.categories && event.categories.length > 0) {
      return event.categories[0].nameCategory;
    }
    return 'Sans catégorie';
  }
}
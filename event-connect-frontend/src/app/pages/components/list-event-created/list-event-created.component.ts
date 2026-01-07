import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { EventService } from '../../../services/event/event.service';
import { Event } from '../../../shared/models/Event';
import Swal from 'sweetalert2';

/**
 * Toast Interface
 */
interface Toast {
  id: number;
  type: 'success' | 'error' | 'warning';
  message: string;
}

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
  toasts: Toast[] = []; // Système de toasts

  private eventService = inject(EventService);
  private router = inject(Router);

  ngOnInit(): void {
    this.loadEvents();
  }

  /**
   * Charger tous les événements
   */
  loadEvents(): void {
    this.isLoading = true;
    this.errorMessage = '';
    
    this.eventService.getAllEvents().subscribe({
      next: (events: Event[]) => {
        this.events = events;
        this.isLoading = false;
      },
      error: (error: Error) => {
        console.error('❌ Erreur chargement:', error.message);
        this.errorMessage = error.message;
        this.isLoading = false;
        this.addToast('error', error.message);
      }
    });
  }

  /**
   * Éditer un événement
   */
  editEvent(eventId?: number): void {
    if (!eventId) {
      console.error('❌ ID événement manquant');
      this.addToast('error', 'Impossible de modifier cet événement ⚠️');
      return;
    }
    this.router.navigate(['/edit-event', eventId]);
  }

 /**
   * Supprimer un événement
   */
  async deleteEvent(eventId?: number): Promise<void> {
    if (!eventId) {
      console.error('❌ ID événement manquant');
      this.addToast('error', 'Impossible de supprimer cet événement ⚠️');
      return;
    }

    const result = await Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: 'Vous ne pourrez pas revenir en arrière !',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#DC2626',
      cancelButtonColor: '#6B7280',
      confirmButtonText: 'Oui, supprimer',
      cancelButtonText: 'Annuler',
      reverseButtons: true
    });

    if (!result.isConfirmed) {
      return;
    }

    this.eventService.deleteEvent(eventId).subscribe({
      next: (response: any) => {
        this.addToast('success', '🗑️ Événement supprimé avec succès !');
        // Recharger la liste
        this.loadEvents();
      },
      error: (error: Error) => {
        console.error('❌ Erreur suppression:', error.message);
        this.addToast('error', error.message);
      }
    });
  }

  /**
   * Créer un nouvel événement
   */
  createNewEvent(): void {
    this.router.navigate(['/create-event']);
  }

  /**
   * Méthodes utilitaires pour le template
   */
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

  getImageUrl(event: Event): string {
    return this.eventService.getImageUrl(event.imgUrl ?? '');
  }

  getCategoryName(event: Event): string {
    if (event.categories && event.categories.length > 0) {
      return event.categories[0].nameCategory;
    }
    return 'Sans catégorie';
  }

  /**
   * Système de toasts
   */
  private addToast(type: 'success' | 'error' | 'warning', message: string): void {
    const toast: Toast = {
      id: Date.now(),
      type,
      message
    };
    this.toasts.push(toast);
    setTimeout(() => this.removeToast(toast.id), 5000);
  }

  removeToast(id: number): void {
    this.toasts = this.toasts.filter(toast => toast.id !== id);
  }
}
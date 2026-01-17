import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EventService } from '../../services/event/event.service';
import { Event } from '../../shared/models/Event';

/**
 * 🎨 Interface Toast
 */
interface Toast {
  id: number;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
}

@Component({
  selector: 'app-event-details-page',
  imports: [CommonModule],
  templateUrl: './event-details-page.component.html',
  styleUrl: './event-details-page.component.css'
})
export class EventDetailsPageComponent implements OnInit {
  event!: Event;
  isLoading: boolean = true;
  toasts: Toast[] = [];

  constructor(
    public activatedRoute: ActivatedRoute, 
    readonly eventService: EventService,
    readonly router: Router
  ) {}

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      const id = Number(params['id']);
      
      if (!id || isNaN(id)) {
        this.addToast('error', 'ID d\'événement invalide ⚠️');
        setTimeout(() => this.router.navigate(['/home']), 2000);
        return;
      }

      this.loadEventDetails(id);
    });
  }

  /**
   * 📥 Charger les détails de l'événement
   */
  private loadEventDetails(id: number): void {
    this.isLoading = true;

    this.eventService.getEventById(id).subscribe({
      next: (event) => {
        this.event = event;
        this.isLoading = false;
      },
      error: (error: Error) => {
        console.error('❌ Erreur chargement événement:', error.message);
        this.addToast('error', error.message || 'Impossible de charger cet événement');
        this.isLoading = false;
        
        setTimeout(() => this.router.navigate(['/home']), 2000);
      }
    });
  }

  /**
   * ⬅️ Retour à la page précédente
   */
  goBack(): void {
    globalThis.history.back();
  }

  /**
   * 🖼️ Obtenir l'URL complète de l'image
   */
  getImageUrl(filename: string | undefined): string {
    return this.eventService.getImageUrl(filename);
  }

  /**
   * 🎨 Ajouter un toast
   */
  private addToast(type: 'success' | 'error' | 'warning' | 'info', message: string): void {
    const toast: Toast = {
      id: Date.now(),
      type,
      message
    };
    
    this.toasts.push(toast);
    setTimeout(() => this.removeToast(toast.id), 5000);
  }

  /**
   * 🗑️ Supprimer un toast
   */
  removeToast(id: number): void {
    this.toasts = this.toasts.filter(toast => toast.id !== id);
  }
}
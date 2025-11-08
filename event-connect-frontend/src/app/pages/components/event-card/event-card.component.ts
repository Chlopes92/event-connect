import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { CategoryService } from '../../../services/category/category.service';
import { Category } from '../../../shared/models/Category';
import { Event } from '../../../shared/models/Event';
import { EventService } from '../../../services/event/event.service';
import { RouterLink } from '@angular/router';

interface Filter {
  id: string;
  label: string;
  active: boolean;
}

@Component({
  selector: 'app-event-card',
  imports: [CommonModule],
  templateUrl: './event-card.component.html',
  styleUrl: './event-card.component.css'
})
export class EventCardComponent {
  events: Event[] = [];
  categories: Category[] = [];
  filters: Filter[] = [];

  visibleEventsCount = 6;

  private categoryService = inject(CategoryService);
  private eventService = inject(EventService);

  ngOnInit(): void {
    this.loadCategories();
    this.loadEvents();
  }

  /** Charge les événements depuis le service */
  private loadEvents(): void {
    this.eventService.getAllEvents().subscribe((data: Event[]) => {
      this.events = data;
    });
  }

  /** Charge les catégories et initialise les filtres */
  private loadCategories(): void {
    this.categoryService.getAllCategories().subscribe((data: Category[]) => {
      // Supprime la catégorie "Tout" si elle existe déjà en BDD
      this.categories = data.filter(cat => cat.nameCategory.toLowerCase() !== 'tout');

      // Crée les filtres avec un bouton "Tout" par défaut
      this.filters = [
        { id: 'tous', label: 'Tout', active: true },
        ...this.categories.map(category => ({
          id: String(category.id),
          label: category.nameCategory,
          active: false
        }))
      ];
    });
  }

  /** Retourne les événements filtrés par catégorie */
  get filteredEvents(): Event[] {
    const activeFilter = this.filters.find(f => f.active);
    if (!activeFilter || activeFilter.id === 'tous') {
      return this.events;
    }

    return this.events.filter(event =>
      event.categories?.some(cat => String(cat.id) === activeFilter.id)
    );
  }

  /** Retourne les événements visibles (2 lignes = 6 cartes par défaut) */
  get visibleEvents(): Event[] {
    return this.filteredEvents.slice(0, this.visibleEventsCount);
  }

  /** Gestion du changement de filtre */
  toggleFilter(filterId: string): void {
    this.filters.forEach(filter => filter.active = filter.id === filterId);
    this.visibleEventsCount = 6;
  }

  /** Renvoie le nom de la catégorie active (utile pour le message “aucun événement”) */
  getActiveCategoryLabel(): string {
    const active = this.filters.find(f => f.active);
    return active ? active.label : '';
  }

  /** Bouton “En voir +” */
  loadMoreEvents(): void {
    this.visibleEventsCount = this.filteredEvents.length;
  }

  /** Boutons d’action */
  shareEvent(event: Event): void {
    console.log('Partager :', event.nameEvent);
    // Implémentation du partage
  }

  toggleFavorite(event: Event): void {
    console.log('Favori :', event.nameEvent);
    // Implémentation du favori
  }

}

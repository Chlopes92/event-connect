import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { CategoryService } from '../../../services/category/category.service';
import { Category } from '../../../shared/models/Category';
import { Event } from '../../../shared/models/Event';
import { EventService } from '../../../services/event/event.service';

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

  private categoryService = inject(CategoryService);
  private eventService = inject(EventService);

  ngOnInit(): void {
    this.loadCategories();
    this.loadEvents();
  }

  private loadEvents(): void {
    this.eventService.getAllEvents().subscribe((data: Event[]) => {
      this.events = data;
    });
  }

  private loadCategories(): void {
    this.categoryService.getAllCategories().subscribe((data: Category[]) => {
      this.categories = data;
  
      this.filters = this.categories.map((category, index) => ({
        id: String(category.id),
        label: category.nameCategory,
        active: index === 0
      }));
    });
  }

  get filteredEvents(): Event[] {
    const activeFilter = this.filters.find(f => f.active);
    if (!activeFilter || activeFilter.id === 'tous') {
      return this.events;
    }

    return this.events.filter(event =>
      event.categories?.some(cat => String(cat.id) === activeFilter.id)
    );
  }

  getCategoryNames(event: Event): string {
    return event.categories?.map(cat => cat.nameCategory).join(', ') || '';
  }

  toggleFilter(filterId: string): void {
    this.filters.forEach(filter => {
      filter.active = filter.id === filterId;
    });
  }

  shareEvent(event: Event): void {
    console.log('Sharing event:', event.nameEvent);
    // Implémentation du partage
  }

  toggleFavorite(event: Event): void {
    console.log('Toggle favorite for:', event.nameEvent);
    // Implémentation du favori
  }

  loadMoreEvents(): void {
    console.log('Loading more events...');
    // Implémentation "load more"
  }

}

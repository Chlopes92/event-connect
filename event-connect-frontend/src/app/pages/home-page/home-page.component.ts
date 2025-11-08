import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventCardComponent } from '../components/event-card/event-card.component';
import { CarouselComponent } from '../components/carousel/carousel.component';
import { EventService } from '../../services/event/event.service';
import { CategoryService } from '../../services/category/category.service';
import { Event } from '../../shared/models/Event';
import { Category } from '../../shared/models/Category';

interface Filter {
  id: string;
  label: string;
  active: boolean;
}

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [CommonModule, CarouselComponent, EventCardComponent],
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent {
  events: Event[] = [];
  categories: Category[] = [];
  filters: Filter[] = [];
  visibleEventsCount = 6;

  private eventService = inject(EventService);
  private categoryService = inject(CategoryService);

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
      this.categories = data.filter(cat => cat.nameCategory.toLowerCase() !== 'tout');
      this.filters = [
        { id: 'tous', label: 'Tout', active: true },
        ...this.categories.map(cat => ({
          id: String(cat.id),
          label: cat.nameCategory,
          active: false
        }))
      ];
    });
  }

  get filteredEvents(): Event[] {
    const activeFilter = this.filters.find(f => f.active);
    if (!activeFilter || activeFilter.id === 'tous') return this.events;
    return this.events.filter(event =>
      event.categories?.some(cat => String(cat.id) === activeFilter.id)
    );
  }

  get visibleEvents(): Event[] {
    return this.filteredEvents.slice(0, this.visibleEventsCount);
  }

  loadMoreEvents(): void {
    this.visibleEventsCount += 6;
  }

  toggleFilter(filterId: string): void {
    this.filters.forEach(f => f.active = f.id === filterId);
    this.visibleEventsCount = 6;
  }

  get activeCategoryLabel(): string {
    const active = this.filters.find(f => f.active);
    return active ? active.label : '';
  }
}

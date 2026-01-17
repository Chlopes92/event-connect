import { Component, inject, OnInit } from '@angular/core';
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
export class HomePageComponent implements OnInit {
  events: Event[] = [];
  categories: Category[] = [];
  filters: Filter[] = [];
  visibleEventsCount = 6;
  
  // 🆕 Loading states
  isLoadingEvents: boolean = true;
  isLoadingCategories: boolean = true;

  readonly eventService = inject(EventService);
  readonly categoryService = inject(CategoryService);

  ngOnInit(): void {
    this.loadCategories();
    this.loadEvents();
  }

  /**
   * 📥 Charger les événements
   */
  private loadEvents(): void {
    this.isLoadingEvents = true;
    
    this.eventService.getAllEvents().subscribe({
      next: (data: Event[]) => {
        this.events = data;
        this.isLoadingEvents = false;
      },
      error: (error) => {
        console.error('❌ Erreur chargement événements:', error);
        this.isLoadingEvents = false;
      }
    });
  }

  /**
   * 📥 Charger les catégories
   */
  private loadCategories(): void {
    this.isLoadingCategories = true;
    
    this.categoryService.getAllCategories().subscribe({
      next: (data: Category[]) => {
        this.categories = data.filter(cat => cat.nameCategory.toLowerCase() !== 'tout');
        this.filters = [
          { id: 'tous', label: 'Tout', active: true },
          ...this.categories.map(cat => ({
            id: String(cat.id),
            label: cat.nameCategory,
            active: false
          }))
        ];
        this.isLoadingCategories = false;
      },
      error: (error) => {
        console.error('❌ Erreur chargement catégories:', error);
        this.isLoadingCategories = false;
      }
    });
  }

  /**
   * 🔄 Loading général (événements OU catégories en cours)
   */
  get isLoading(): boolean {
    return this.isLoadingEvents || this.isLoadingCategories;
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
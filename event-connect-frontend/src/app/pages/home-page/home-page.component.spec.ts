import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
import { HomePageComponent } from './home-page.component';
import { EventService } from '../../services/event/event.service';
import { CategoryService } from '../../services/category/category.service';
import { Event } from '../../shared/models/Event';
import { Category } from '../../shared/models/Category';

describe('HomePageComponent', () => {
  let component: HomePageComponent;
  let fixture: ComponentFixture<HomePageComponent>;
  let eventService: jasmine.SpyObj<EventService>;
  let categoryService: jasmine.SpyObj<CategoryService>;

  const mockCategories: Category[] = [
    { id: 1, nameCategory: 'Musique' },
    { id: 2, nameCategory: 'Sport' },
    { id: 3, nameCategory: 'Tout' }
  ];

  const mockEvents: Event[] = [
    {
      id: 1,
      nameEvent: 'Concert Rock',
      title: 'Concert Rock',
      description: 'Super concert',
      dateEvent: '2024-12-31',
      program: 'Programme musical',
      contact: 'contact@concert.com',
      address: '123 Rue de la Musique',
      categories: [{ id: 1, nameCategory: 'Musique' }]
    } as Event,
    {
      id: 2,
      nameEvent: 'Match Football',
      title: 'Match Football',
      description: 'Match important',
      dateEvent: '2024-12-25',
      program: 'Programme sportif',
      contact: 'contact@sport.com',
      address: '456 Avenue du Sport',
      categories: [{ id: 2, nameCategory: 'Sport' }]
    } as Event,
    {
      id: 3,
      nameEvent: 'Festival Jazz',
      title: 'Festival Jazz',
      description: 'Festival de jazz',
      dateEvent: '2025-01-15',
      program: 'Programme jazz',
      contact: 'contact@jazz.com',
      address: '789 Boulevard du Jazz',
      categories: [{ id: 1, nameCategory: 'Musique' }]
    } as Event
  ];

  beforeEach(async () => {
    const eventServiceSpy = jasmine.createSpyObj('EventService', ['getAllEvents', 'getImageUrl']);
    const categoryServiceSpy = jasmine.createSpyObj('CategoryService', ['getAllCategories']);

    await TestBed.configureTestingModule({
      imports: [HomePageComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: EventService, useValue: eventServiceSpy },
        { provide: CategoryService, useValue: categoryServiceSpy }
      ]
    }).compileComponents();

    eventService = TestBed.inject(EventService) as jasmine.SpyObj<EventService>;
    categoryService = TestBed.inject(CategoryService) as jasmine.SpyObj<CategoryService>;

    eventService.getAllEvents.and.returnValue(of(mockEvents));
    eventService.getImageUrl.and.returnValue('assets/default-image.jpg');
    categoryService.getAllCategories.and.returnValue(of(mockCategories));

    fixture = TestBed.createComponent(HomePageComponent);
    component = fixture.componentInstance;
  });

  // ===== TESTS ESSENTIELS =====

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Test loadEvents - success
  it('should load events successfully', () => {
    fixture.detectChanges();
    
    expect(component.events).toEqual(mockEvents);
    expect(component.isLoadingEvents).toBe(false);
  });

  // Test loadEvents - error
  it('should handle events loading error', () => {
    spyOn(console, 'error');
    eventService.getAllEvents.and.returnValue(throwError(() => new Error('Error')));
    
    fixture.detectChanges();
    
    expect(component.isLoadingEvents).toBe(false);
  });

  // Test loadCategories - success
  it('should load and filter categories', () => {
    fixture.detectChanges();
    
    expect(component.categories.length).toBe(2); // "Tout" filtered
    expect(component.filters[0].label).toBe('Tout');
    expect(component.filters[0].active).toBe(true);
    expect(component.isLoadingCategories).toBe(false);
  });

  // Test loadCategories - error
  it('should handle categories loading error', () => {
    spyOn(console, 'error');
    categoryService.getAllCategories.and.returnValue(throwError(() => new Error('Error')));
    
    fixture.detectChanges();
    
    expect(component.isLoadingCategories).toBe(false);
  });

  // Test isLoading getter
  it('should return true when loading', () => {
    component.isLoadingEvents = true;
    component.isLoadingCategories = false;
    expect(component.isLoading).toBe(true);
  });

  it('should return false when not loading', () => {
    component.isLoadingEvents = false;
    component.isLoadingCategories = false;
    expect(component.isLoading).toBe(false);
  });

  // Test filteredEvents getter - "Tout" filter
  it('should return all events with "Tout" filter', () => {
    fixture.detectChanges();
    
    expect(component.filteredEvents).toEqual(mockEvents);
  });

  // Test filteredEvents getter - specific category
  it('should filter events by category', () => {
    fixture.detectChanges();
    component.toggleFilter('1'); // Musique
    
    expect(component.filteredEvents.length).toBe(2);
  });

  // Test filteredEvents with no active filter
  it('should return all events when no filter is active', () => {
    fixture.detectChanges();
    component.filters.forEach(f => f.active = false);
    
    expect(component.filteredEvents).toEqual(mockEvents);
  });

  // Test visibleEvents getter
  it('should limit visible events', () => {
    fixture.detectChanges();
    component.visibleEventsCount = 2;
    
    expect(component.visibleEvents.length).toBe(2);
  });

  // Test loadMoreEvents
  it('should increment visible count by 6', () => {
    component.visibleEventsCount = 6;
    component.loadMoreEvents();
    expect(component.visibleEventsCount).toBe(12);
  });

  // Test toggleFilter
  it('should toggle filter and reset count', () => {
    fixture.detectChanges();
    component.visibleEventsCount = 12;
    
    component.toggleFilter('1');
    
    expect(component.filters[1].active).toBe(true);
    expect(component.visibleEventsCount).toBe(6);
  });

  it('should deactivate all other filters when toggling', () => {
    fixture.detectChanges();
    
    component.toggleFilter('2'); // Sport
    
    expect(component.filters[0].active).toBe(false); // Tout
    expect(component.filters[1].active).toBe(false); // Musique
    expect(component.filters[2].active).toBe(true);  // Sport
  });

  // Test activeCategoryLabel getter
  it('should return active category label', () => {
    fixture.detectChanges();
    expect(component.activeCategoryLabel).toBe('Tout');
    
    component.toggleFilter('1');
    expect(component.activeCategoryLabel).toBe('Musique');
  });

  it('should return empty string when no filter is active', () => {
    component.filters = [
      { id: '1', label: 'Test', active: false }
    ];
    
    expect(component.activeCategoryLabel).toBe('');
  });

  // Test edge cases
  it('should handle events without categories', () => {
    const eventWithoutCategories: Event = {
      id: 4,
      nameEvent: 'Event sans catégorie',
      title: 'Event sans catégorie',
      description: 'Test',
      dateEvent: '2024-12-31',
      program: 'Programme',
      contact: 'contact@test.com',
      address: 'Address',
      categories: [] // Empty categories array
    } as Event;
    
    component.events = [eventWithoutCategories];
    component.filters = [{ id: '1', label: 'Test', active: true }];
    
    expect(component.filteredEvents.length).toBe(0);
  });

  // Integration test
  it('should handle complete user flow', () => {
    fixture.detectChanges();
    
    // Initial load
    expect(component.events.length).toBe(3);
    expect(component.filters.length).toBe(3);
    
    // Filter by category
    component.toggleFilter('1');
    expect(component.filteredEvents.length).toBe(2);
    expect(component.activeCategoryLabel).toBe('Musique');
    
    // Load more
    component.loadMoreEvents();
    expect(component.visibleEventsCount).toBe(12);
    
    // Toggle back to "Tout"
    component.toggleFilter('tous');
    expect(component.filteredEvents.length).toBe(3);
    expect(component.visibleEventsCount).toBe(6); // Reset
  });
});
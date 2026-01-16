import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { ListEventCreatedComponent } from './list-event-created.component';
<<<<<<< Updated upstream
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
=======
<<<<<<< Updated upstream
=======
import { EventService } from '../../../services/event/event.service';
import { Event } from '../../../shared/models/Event';
import Swal from 'sweetalert2';
>>>>>>> Stashed changes
>>>>>>> Stashed changes

describe('ListEventCreatedComponent', () => {
  let component: ListEventCreatedComponent;
  let fixture: ComponentFixture<ListEventCreatedComponent>;
  let mockEventService: jasmine.SpyObj<EventService>;
  let mockRouter: jasmine.SpyObj<Router>;

  const mockEvents: Event[] = [
    {
      id: 1,
      nameEvent: 'Festival de Musique',
      description: 'Grand festival d\'été',
      dateEvent: '2026-07-15',
      program: 'Programme détaillé',
      contact: 'contact@festival.com',
      price: 25,
      numberPlace: 500,
      address: 'Place de la République, Paris',
      imgUrl: 'festival.jpg',
      categories: [{ id: 1, nameCategory: 'Festival' }]
    }
  ];

  beforeEach(async () => {
    mockEventService = jasmine.createSpyObj('EventService', [
      'getAllEvents',
      'deleteEvent',
      'getImageUrl'
    ]);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    spyOn(Swal, 'fire').and.returnValue(Promise.resolve({
      isConfirmed: true,
      isDenied: false,
      isDismissed: false
    } as any));

    await TestBed.configureTestingModule({
<<<<<<< Updated upstream
      imports: [ListEventCreatedComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    }).compileComponents();
=======
<<<<<<< Updated upstream
      imports: [ListEventCreatedComponent]
    })
    .compileComponents();
=======
      imports: [ListEventCreatedComponent],
      providers: [
        { provide: EventService, useValue: mockEventService },
        { provide: Router, useValue: mockRouter }
      ]
    }).compileComponents();
>>>>>>> Stashed changes
>>>>>>> Stashed changes

    fixture = TestBed.createComponent(ListEventCreatedComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load events on init', fakeAsync(() => {
    mockEventService.getAllEvents.and.returnValue(of(mockEvents));
    fixture.detectChanges();
    tick();
    expect(component.events).toEqual(mockEvents);
  }));

  it('should navigate to edit event', () => {
    component.editEvent(1);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/edit-event', 1]);
  });

  it('should delete event after confirmation', fakeAsync(async () => {
    mockEventService.deleteEvent.and.returnValue(of('Success'));
    mockEventService.getAllEvents.and.returnValue(of([]));
    await component.deleteEvent(1);
    tick();
    expect(mockEventService.deleteEvent).toHaveBeenCalledWith(1);
  }));

  it('should navigate to create event', () => {
    component.createNewEvent();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/create-event']);
  });

  it('should format price correctly', () => {
    expect(component.getEventPrice(mockEvents[0])).toBe('25 €');
  });

  it('should format date correctly', () => {
    const result = component.getEventDate(mockEvents[0]);
    expect(result).toContain('2026');
  });

  it('should get category name', () => {
    expect(component.getCategoryName(mockEvents[0])).toBe('Festival');
  });

  it('should remove toast', () => {
    component.toasts = [{ id: 1, type: 'success', message: 'Test' }];
    component.removeToast(1);
    expect(component.toasts.length).toBe(0);
  });
});
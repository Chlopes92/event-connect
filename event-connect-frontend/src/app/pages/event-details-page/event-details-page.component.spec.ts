import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
import { EventDetailsPageComponent } from './event-details-page.component';
import { EventService } from '../../services/event/event.service';
import { Event } from '../../shared/models/Event';

describe('EventDetailsPageComponent', () => {
  let component: EventDetailsPageComponent;
  let fixture: ComponentFixture<EventDetailsPageComponent>;
  let eventService: jasmine.SpyObj<EventService>;
  let router: jasmine.SpyObj<Router>;
  let activatedRoute: any;

  const mockEvent: Event = {
    id: 1,
    nameEvent: 'Test Event',
    imgUrl: 'test.png',
    description: 'Test description',
    dateEvent: '2025-12-31',
    program: 'Test program',
    contact: 'test@example.com',
    price: 10,
    numberPlace: 100,
    address: 'Test Address',
    categories: [{ id: 1, nameCategory: 'Festival' }]
  };

  beforeEach(async () => {
    const eventServiceSpy = jasmine.createSpyObj('EventService', ['getEventById', 'getImageUrl']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    activatedRoute = {
      params: of({ id: '1' })
    };

    await TestBed.configureTestingModule({
      imports: [EventDetailsPageComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        { provide: EventService, useValue: eventServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: activatedRoute }
      ]
    }).compileComponents();

    eventService = TestBed.inject(EventService) as jasmine.SpyObj<EventService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    fixture = TestBed.createComponent(EventDetailsPageComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load event details on init with valid ID', () => {
    eventService.getEventById.and.returnValue(of(mockEvent));

    fixture.detectChanges(); // Déclenche ngOnInit

    expect(eventService.getEventById).toHaveBeenCalledWith(1);
    expect(component.event).toEqual(mockEvent);
    expect(component.isLoading).toBeFalse();
  });

  it('should show error toast and redirect when ID is invalid', fakeAsync(() => {
    activatedRoute.params = of({ id: 'invalid' });
    spyOn(component as any, 'addToast');

    fixture.detectChanges();
    tick(2100); // Avancer le temps de 2100ms

    expect((component as any).addToast).toHaveBeenCalledWith('error', "ID d'événement invalide ⚠️");
    expect(router.navigate).toHaveBeenCalledWith(['/home']);
  }));

  it('should show error toast and redirect when ID is NaN', fakeAsync(() => {
    activatedRoute.params = of({ id: 'abc' });
    spyOn(component as any, 'addToast');

    fixture.detectChanges();
    tick(2100);

    expect((component as any).addToast).toHaveBeenCalledWith('error', "ID d'événement invalide ⚠️");
    expect(router.navigate).toHaveBeenCalledWith(['/home']);
  }));

  it('should handle error when loading event fails', fakeAsync(() => {
    const error = new Error('Network error');
    eventService.getEventById.and.returnValue(throwError(() => error));
    spyOn(component as any, 'addToast');
    
    component.event = mockEvent;

    fixture.detectChanges();
    tick(2100);

    expect(component.isLoading).toBeFalse();
    expect((component as any).addToast).toHaveBeenCalledWith('error', 'Network error');
    expect(router.navigate).toHaveBeenCalledWith(['/home']);
  }));

  it('should call history.back() when goBack is called', () => {
    spyOn(globalThis.history, 'back');

    component.goBack();

    expect(globalThis.history.back).toHaveBeenCalled();
  });

  it('should return image URL from event service', () => {
    const filename = 'test.png';
    const expectedUrl = 'http://localhost:8080/upload/images/test.png';
    eventService.getImageUrl.and.returnValue(expectedUrl);

    const result = component.getImageUrl(filename);

    expect(result).toBe(expectedUrl);
    expect(eventService.getImageUrl).toHaveBeenCalledWith(filename);
  });

  it('should add toast to toasts array', () => {
    (component as any).addToast('success', 'Test message');

    expect(component.toasts.length).toBe(1);
    expect(component.toasts[0].type).toBe('success');
    expect(component.toasts[0].message).toBe('Test message');
  });

  it('should remove toast after 5 seconds', fakeAsync(() => {
    (component as any).addToast('info', 'Test');
    expect(component.toasts.length).toBe(1);

    tick(5001); // Avancer de 5001ms

    expect(component.toasts.length).toBe(0);
  }));

});
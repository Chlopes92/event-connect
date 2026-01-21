import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { EventService } from './event.service';
import { Event } from '../../shared/models/Event';
import { EVENT_URL, UPLOAD_IMAGE_URL } from '../../shared/constants/urls';

describe('EventService', () => {
   let service: EventService;
  let httpMock: HttpTestingController;

  // Mock data - Types corrects selon tes models
  const mockEvent: Event = {
    id: 1,
    nameEvent: 'Test Event',
    imgUrl: 'test-image.png',
    description: 'Test description',
    dateEvent: '2026-06-15', // ✅ string, pas Date
    program: 'Test program',
    contact: 'test@example.com',
    price: 10.00,
    numberPlace: 100,
    address: 'Test Address',
    categories: [{ id: 1, nameCategory: 'Festival' }]
  };

  const mockEvents: Event[] = [mockEvent];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        EventService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    
    service = TestBed.inject(EventService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // ============================================
  // TESTS getAllEvents()
  // ============================================
  
  describe('getAllEvents()', () => {
    it('should retrieve all events via GET', () => {
      service.getAllEvents().subscribe(events => {
        expect(events).toEqual(mockEvents);
        expect(events.length).toBe(1);
        expect(events[0].nameEvent).toBe('Test Event');
      });

      const req = httpMock.expectOne(EVENT_URL);
      expect(req.request.method).toBe('GET');
      req.flush(mockEvents);
    });

    it('should handle error when getting all events', () => {
      const errorMessage = 'Erreur serveur';
      
      service.getAllEvents().subscribe({
        next: () => fail('should have failed with 500 error'),
        error: (error) => {
          expect(error.message).toContain('Erreur serveur');
        }
      });

      const req = httpMock.expectOne(EVENT_URL);
      req.flush(errorMessage, { status: 500, statusText: 'Server Error' });
    });
  });

  // ============================================
  // TESTS getEventById()
  // ============================================
  
  describe('getEventById()', () => {
    it('should retrieve a single event by ID', () => {
      const eventId = 1;
      
      service.getEventById(eventId).subscribe(event => {
        expect(event).toEqual(mockEvent);
        expect(event.id).toBe(eventId);
        expect(event.nameEvent).toBe('Test Event');
      });

      const req = httpMock.expectOne(`${EVENT_URL}/${eventId}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockEvent);
    });

    it('should handle 404 error when event not found', () => {
      const eventId = 999;
      
      service.getEventById(eventId).subscribe({
        next: () => fail('should have failed with 404 error'),
        error: (error) => {
          expect(error.message).toContain('Événement non trouvé');
        }
      });

      const req = httpMock.expectOne(`${EVENT_URL}/${eventId}`);
      req.flush('Not found', { status: 404, statusText: 'Not Found' });
    });
  });

  // ============================================
  // TESTS getEventsByCategory()
  // ============================================
  
  describe('getEventsByCategory()', () => {
    it('should retrieve events filtered by category', () => {
      const categoryId = 1;
      
      service.getEventsByCategory(categoryId).subscribe(events => {
        expect(events).toEqual(mockEvents);
        expect(events.length).toBe(1);
        expect(events[0].categories[0].id).toBe(categoryId);
      });

      const req = httpMock.expectOne(`${EVENT_URL}/by-category/${categoryId}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockEvents);
    });

    it('should return empty array when no events in category', () => {
      const categoryId = 999;
      
      service.getEventsByCategory(categoryId).subscribe(events => {
        expect(events).toEqual([]);
        expect(events.length).toBe(0);
      });

      const req = httpMock.expectOne(`${EVENT_URL}/by-category/${categoryId}`);
      req.flush([]);
    });
  });

  // ============================================
  // TESTS createEvent()
  // ============================================
  
  describe('createEvent()', () => {
    it('should create event with image via POST', () => {
      const newEvent: Event = { 
        nameEvent: 'New Event',
        description: 'Description',
        dateEvent: '2026-07-01',
        program: 'Program',
        contact: 'contact@test.com',
        address: 'Address',
        categories: []
      };
      const imageFile = new File(['image'], 'test.png', { type: 'image/png' });
      const successMessage = 'Événement créé avec succès';

      service.createEvent(newEvent, imageFile).subscribe(response => {
        expect(response).toBe(successMessage);
      });

      const req = httpMock.expectOne(EVENT_URL);
      expect(req.request.method).toBe('POST');
      expect(req.request.body instanceof FormData).toBe(true);
      req.flush(successMessage);
    });

    it('should create event without image', () => {
      const newEvent: Event = {
        nameEvent: 'New Event',
        description: 'Description',
        dateEvent: '2026-07-01',
        program: 'Program',
        contact: 'contact@test.com',
        address: 'Address',
        categories: []
      };
      const successMessage = 'Événement créé';

      service.createEvent(newEvent).subscribe(response => {
        expect(response).toBe(successMessage);
      });

      const req = httpMock.expectOne(EVENT_URL);
      expect(req.request.method).toBe('POST');
      req.flush(successMessage);
    });

    it('should handle 401 error when not authenticated', () => {
      const newEvent: Event = {
        nameEvent: 'Event',
        description: 'Desc',
        dateEvent: '2026-07-01',
        program: 'Prog',
        contact: 'contact@test.com',
        address: 'Addr',
        categories: []
      };
      
      service.createEvent(newEvent).subscribe({
        next: () => fail('should have failed with 401 error'),
        error: (error) => {
          expect(error.message).toContain('Vous devez être connecté');
        }
      });

      const req = httpMock.expectOne(EVENT_URL);
      req.flush('Unauthorized', { status: 401, statusText: 'Unauthorized' });
    });

    it('should handle 400 error for invalid file', () => {
      const newEvent: Event = {
        nameEvent: 'Event',
        description: 'Desc',
        dateEvent: '2026-07-01',
        program: 'Prog',
        contact: 'contact@test.com',
        address: 'Addr',
        categories: []
      };
      const imageFile = new File(['image'], 'test.exe', { type: 'application/exe' });
      
      service.createEvent(newEvent, imageFile).subscribe({
        next: () => fail('should have failed with 400 error'),
        error: (error) => {
          expect(error.message).toContain('Données invalides');
        }
      });

      const req = httpMock.expectOne(EVENT_URL);
      req.flush('Invalid file', { status: 400, statusText: 'Bad Request' });
    });
  });

  // ============================================
  // TESTS updateEvent()
  // ============================================
  
  describe('updateEvent()', () => {
    it('should update event with new image', () => {
      const eventId = 1;
      const updatedEvent: Event = { ...mockEvent, nameEvent: 'Updated Event' };
      const imageFile = new File(['image'], 'new-image.png', { type: 'image/png' });
      const successMessage = 'Événement mis à jour';

      service.updateEvent(eventId, updatedEvent, imageFile).subscribe(response => {
        expect(response).toBe(successMessage);
      });

      const req = httpMock.expectOne(`${EVENT_URL}/${eventId}`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body instanceof FormData).toBe(true);
      req.flush(successMessage);
    });

    it('should update event without changing image', () => {
      const eventId = 1;
      const updatedEvent: Event = { ...mockEvent, description: 'Updated description' };
      const successMessage = 'Événement mis à jour';

      service.updateEvent(eventId, updatedEvent).subscribe(response => {
        expect(response).toBe(successMessage);
      });

      const req = httpMock.expectOne(`${EVENT_URL}/${eventId}`);
      expect(req.request.method).toBe('PUT');
      req.flush(successMessage);
    });

    it('should handle 403 error when not authorized', () => {
      const eventId = 1;
      const updatedEvent: Event = mockEvent;
      
      service.updateEvent(eventId, updatedEvent).subscribe({
        next: () => fail('should have failed with 403 error'),
        error: (error) => {
          expect(error.message).toContain('pas autorisé');
        }
      });

      const req = httpMock.expectOne(`${EVENT_URL}/${eventId}`);
      req.flush('Forbidden', { status: 403, statusText: 'Forbidden' });
    });
  });

  // ============================================
  // TESTS deleteEvent()
  // ============================================
  
  describe('deleteEvent()', () => {
    it('should delete event by ID', () => {
      const eventId = 1;
      const successMessage = 'Événement supprimé';

      service.deleteEvent(eventId).subscribe(response => {
        expect(response).toBe(successMessage);
      });

      const req = httpMock.expectOne(`${EVENT_URL}/${eventId}`);
      expect(req.request.method).toBe('DELETE');
      req.flush(successMessage);
    });

    it('should handle 403 error when not the creator', () => {
      const eventId = 1;
      
      service.deleteEvent(eventId).subscribe({
        next: () => fail('should have failed with 403 error'),
        error: (error) => {
          expect(error.message).toContain('pas autorisé');
        }
      });

      const req = httpMock.expectOne(`${EVENT_URL}/${eventId}`);
      req.flush('Forbidden', { status: 403, statusText: 'Forbidden' });
    });

    it('should handle 404 error when event not found', () => {
      const eventId = 999;
      
      service.deleteEvent(eventId).subscribe({
        next: () => fail('should have failed with 404 error'),
        error: (error) => {
          expect(error.message).toContain('Événement non trouvé');
        }
      });

      const req = httpMock.expectOne(`${EVENT_URL}/${eventId}`);
      req.flush('Not found', { status: 404, statusText: 'Not Found' });
    });
  });

  // ============================================
  // TESTS getImageUrl()
  // ============================================
  
  describe('getImageUrl()', () => {
  it('should return assets path in production', () => {
    const filename = 'test-image.png';
    const result = service.getImageUrl(filename);
    // En test, environment.production est true par défaut
    expect(result).toBe(`assets/events/${filename}`);
  });

  // Reste des tests identiques
  it('should return empty string when filename is undefined', () => {
    const result = service.getImageUrl(undefined);
    expect(result).toBe('');
  });

  it('should return empty string when filename is empty', () => {
    const result = service.getImageUrl('');
    expect(result).toBe('');
  });
});

  // ============================================
  // TESTS ERROR HANDLING
  // ============================================
  
  describe('Error Handling', () => {
    it('should handle network errors', () => {
      const errorEvent = new ErrorEvent('Network error', {
        message: 'Network failure'
      });

      service.getAllEvents().subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.message).toContain('Erreur réseau');
        }
      });

      const req = httpMock.expectOne(EVENT_URL);
      req.error(errorEvent);
    });

    it('should handle validation errors from backend', () => {
      const validationError = {
        timestamp: '2026-01-13T15:00:00',
        status: 400,
        error: 'Bad Request',
        message: 'Validation échouée',
        path: '/api/events',
        validationErrors: {
          nameEvent: 'Le nom est obligatoire',
          dateEvent: 'La date doit être future'
        }
      };

      const newEvent: Event = {
        nameEvent: '',
        description: 'Desc',
        dateEvent: '2020-01-01',
        program: 'Prog',
        contact: 'contact@test.com',
        address: 'Addr',
        categories: []
      };

      service.createEvent(newEvent).subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.message).toContain('Validation échouée');
          expect(error.message).toContain('Le nom est obligatoire');
        }
      });

      const req = httpMock.expectOne(EVENT_URL);
      req.flush(validationError, { status: 400, statusText: 'Bad Request' });
    });
  });
});
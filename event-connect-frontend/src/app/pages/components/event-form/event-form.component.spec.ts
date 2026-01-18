import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';
import { EventFormComponent } from './event-form.component';
import { EventService } from '../../../services/event/event.service';
import { CategoryService } from '../../../services/category/category.service';
import { Event } from '../../../shared/models/Event';
import { Category } from '../../../shared/models/Category';

describe('EventFormComponent', () => {
  let component: EventFormComponent;
  let fixture: ComponentFixture<EventFormComponent>;
  let eventService: jasmine.SpyObj<EventService>;
  let categoryService: jasmine.SpyObj<CategoryService>;
  let router: jasmine.SpyObj<Router>;
  let activatedRoute: any;

  const mockCategories: Category[] = [
    { id: 1, nameCategory: 'Festival' },
    { id: 2, nameCategory: 'Concert' }
  ];

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
    categories: mockCategories
  };

  beforeEach(async () => {
    const eventServiceSpy = jasmine.createSpyObj('EventService', [
      'getEventById',
      'createEvent',
      'updateEvent',
      'deleteEvent',
      'getImageUrl'
    ]);
    const categoryServiceSpy = jasmine.createSpyObj('CategoryService', ['getAllCategories']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    activatedRoute = {
      snapshot: {
        paramMap: {
          get: jasmine.createSpy('get').and.returnValue(null)
        }
      }
    };

    await TestBed.configureTestingModule({
      imports: [EventFormComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        { provide: EventService, useValue: eventServiceSpy },
        { provide: CategoryService, useValue: categoryServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: activatedRoute }
      ]
    }).compileComponents();

    eventService = TestBed.inject(EventService) as jasmine.SpyObj<EventService>;
    categoryService = TestBed.inject(CategoryService) as jasmine.SpyObj<CategoryService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    categoryService.getAllCategories.and.returnValue(of(mockCategories));

    fixture = TestBed.createComponent(EventFormComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with empty values', () => {
    fixture.detectChanges();

    expect(component.eventForm).toBeDefined();
    expect(component.eventForm.get('title')?.value).toBe('');
    expect(component.eventForm.get('categories')?.value).toEqual([]);
  });

  it('should load categories on init', () => {
    fixture.detectChanges();

    expect(categoryService.getAllCategories).toHaveBeenCalled();
    expect(component.categories).toEqual(mockCategories);
  });

  it('should enter edit mode when ID is present in route', () => {
    activatedRoute.snapshot.paramMap.get.and.returnValue('1');
    eventService.getEventById.and.returnValue(of(mockEvent));

    fixture.detectChanges();

    expect(component.isEditMode).toBeTrue();
    expect(component.eventId).toBe(1);
    expect(eventService.getEventById).toHaveBeenCalledWith(1);
  });

  it('should load event data in edit mode', () => {
    component.isEditMode = true;
    component.eventId = 1;
    eventService.getEventById.and.returnValue(of(mockEvent));
    eventService.getImageUrl.and.returnValue('http://localhost:8080/upload/images/test.png');

    component.loadEventData(1);

    expect(component.eventForm.get('title')?.value).toBe('Test Event');
    expect(component.eventForm.get('description')?.value).toBe('Test description');
    expect(component.eventForm.get('categories')?.value).toEqual([1, 2]);
  });

  it('should mark form as invalid when submitted empty', () => {
    fixture.detectChanges();
    spyOn(component as any, 'addToast');

    component.onSubmit();

    expect(component.eventForm.invalid).toBeTrue();
    expect((component as any).addToast).toHaveBeenCalledWith(
      'error',
      'Veuillez corriger les erreurs dans le formulaire ⚠️'
    );
  });

  it('should validate required fields', () => {
    fixture.detectChanges();

    const titleControl = component.eventForm.get('title');
    expect(titleControl?.hasError('required')).toBeTrue();

    titleControl?.setValue('Test Event');
    expect(titleControl?.hasError('required')).toBeFalse();
  });

  it('should validate email format', () => {
    fixture.detectChanges();

    const contactControl = component.eventForm.get('contact');
    contactControl?.setValue('invalid-email');
    expect(contactControl?.hasError('email')).toBeTrue();

    contactControl?.setValue('test@example.com');
    expect(contactControl?.hasError('email')).toBeFalse();
  });

  it('should create event when form is valid', fakeAsync(() => {
    fixture.detectChanges();
    eventService.createEvent.and.returnValue(of({} as any));

    component.eventForm.patchValue({
      title: 'New Event',
      date: '2025-12-31',
      participants: 100,
      location: 'Test Location',
      categories: [1],
      description: 'Test description for the event',
      contact: 'test@example.com',
      price: 10,
      programs: 'Test program details'
    });

    component.onSubmit();

    tick(2100); // Avancer de 2100ms

    expect(eventService.createEvent).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/organizer-dashboard']);
  }));

  it('should update event in edit mode', fakeAsync(() => {
    fixture.detectChanges();
    component.isEditMode = true;
    component.eventId = 1;
    eventService.updateEvent.and.returnValue(of({} as any));

    component.eventForm.patchValue({
      title: 'Updated Event',
      date: '2025-12-31',
      participants: 100,
      location: 'Test Location',
      categories: [1],
      description: 'Updated description',
      contact: 'test@example.com'
    });

    component.onSubmit();

    tick(2100);

    expect(eventService.updateEvent).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/organizer-dashboard']);
  }));

  it('should toggle category selection', () => {
    fixture.detectChanges();

    component.toggleCategory(1);
    expect(component.eventForm.get('categories')?.value).toContain(1);

    component.toggleCategory(1);
    expect(component.eventForm.get('categories')?.value).not.toContain(1);
  });

  it('should check if category is selected', () => {
    fixture.detectChanges();
    component.eventForm.patchValue({ categories: [1, 2] });

    expect(component.isCategorySelected(1)).toBeTrue();
    expect(component.isCategorySelected(3)).toBeFalse();
  });

  it('should validate file size on file selection', () => {
    fixture.detectChanges();
    spyOn(component as any, 'addToast');

    const largeFile = new File(['x'.repeat(6 * 1024 * 1024)], 'large.png', { type: 'image/png' });
    const event = { target: { files: [largeFile] } };

    component.onFileSelected(event);

    expect((component as any).addToast).toHaveBeenCalledWith('error', 'Image trop grande (max 5MB) ⚠️');
    expect(component.imageFile).toBeNull();
  });

  it('should validate file type on file selection', () => {
    fixture.detectChanges();
    spyOn(component as any, 'addToast');

    const pdfFile = new File(['content'], 'document.pdf', { type: 'application/pdf' });
    const event = { target: { files: [pdfFile] } };

    component.onFileSelected(event);

    expect((component as any).addToast).toHaveBeenCalledWith(
      'error',
      "Format d'image non autorisé (PNG, JPG, WEBP uniquement) ⚠️"
    );
  });

  it('should accept valid image file', () => {
    fixture.detectChanges();

    const validFile = new File(['content'], 'image.png', { type: 'image/png' });
    Object.defineProperty(validFile, 'size', { value: 1024 });
    const event = { target: { files: [validFile] } };

    component.onFileSelected(event);

    expect(component.imageFile).toBe(validFile);
  });

  it('should remove image', () => {
    component.imageFile = new File(['content'], 'test.png', { type: 'image/png' });
    component.imagePreview = 'data:image/png;base64,xxx';

    component.removeImage();

    expect(component.imageFile).toBeNull();
    expect(component.imagePreview).toBeNull();
  });

  it('should check if field is invalid', () => {
    fixture.detectChanges();

    const titleControl = component.eventForm.get('title');
    titleControl?.markAsTouched();

    expect(component.isFieldInvalid('title')).toBeTrue();

    titleControl?.setValue('Valid Title');
    expect(component.isFieldInvalid('title')).toBeFalse();
  });

  it('should return appropriate error message', () => {
    fixture.detectChanges();

    const titleControl = component.eventForm.get('title');
    titleControl?.setErrors({ required: true });
    expect(component.getFieldError('title')).toBe('Ce champ est requis');

    titleControl?.setErrors({ minlength: { requiredLength: 3 } });
    expect(component.getFieldError('title')).toBe('Minimum 3 caractères');
  });

  it('should navigate back to dashboard', () => {
    component.goBack();

    expect(router.navigate).toHaveBeenCalledWith(['/organizer-dashboard']);
  });

});
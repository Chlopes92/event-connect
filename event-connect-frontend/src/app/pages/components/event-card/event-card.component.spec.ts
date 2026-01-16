import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { EventCardComponent } from './event-card.component';
import { EventService } from '../../../services/event/event.service';
import { ShareService } from '../../../services/share/share.service';
import { Event } from '../../../shared/models/Event';

describe('EventCardComponent', () => {
  let component: EventCardComponent;
  let fixture: ComponentFixture<EventCardComponent>;
  let mockEventService: jasmine.SpyObj<EventService>;
  let mockShareService: jasmine.SpyObj<ShareService>;

  const mockEvent: Event = {
    id: 1,
    nameEvent: 'Test Event',
    description: 'Test',
    dateEvent: '2026-07-15',
    program: 'Program',
    contact: 'test@test.com',
    address: 'Paris',
    categories: []
  };

  beforeEach(async () => {
    mockEventService = jasmine.createSpyObj('EventService', ['getImageUrl']);
    mockShareService = jasmine.createSpyObj('ShareService', ['share']);

    await TestBed.configureTestingModule({
      imports: [EventCardComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: EventService, useValue: mockEventService },
        { provide: ShareService, useValue: mockShareService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EventCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should share event', async () => {
    mockShareService.share.and.returnValue(Promise.resolve(true));
    const mockMouseEvent = new MouseEvent('click');
    spyOn(mockMouseEvent, 'preventDefault');
    spyOn(mockMouseEvent, 'stopPropagation');

    await component.shareEvent(mockEvent, mockMouseEvent);

    expect(mockMouseEvent.preventDefault).toHaveBeenCalled();
    expect(mockShareService.share).toHaveBeenCalled();
  });

  it('should get image URL', () => {
    mockEventService.getImageUrl.and.returnValue('http://test.com/image.jpg');
    const result = component.getImageUrl('test.jpg');
    expect(result).toBe('http://test.com/image.jpg');
  });

  it('should toggle favorite', () => {
    const mockMouseEvent = new MouseEvent('click');
    spyOn(mockMouseEvent, 'preventDefault');
    spyOn(mockMouseEvent, 'stopPropagation');

    component.toggleFavorite(mockEvent, mockMouseEvent);

    expect(mockMouseEvent.preventDefault).toHaveBeenCalled();
    expect(mockMouseEvent.stopPropagation).toHaveBeenCalled();
  });
});
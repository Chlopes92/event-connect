import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { HeaderComponent } from './header.component';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let mockRouter: any;
  let routerEventsSubject: Subject<any>;

  beforeEach(async () => {
    routerEventsSubject = new Subject();
    mockRouter = {
      url: '/home',
      events: routerEventsSubject.asObservable()
    };

    await TestBed.configureTestingModule({
      imports: [HeaderComponent],
      providers: [{ provide: Router, useValue: mockRouter }]
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should detect home page', () => {
    component.checkIfHomePage('/home');
    expect(component.isHomePage).toBe(true);
  });

  it('should scroll to events', () => {
    const mockElement = document.createElement('div');
    spyOn(document, 'getElementById').and.returnValue(mockElement);
    spyOn(mockElement, 'scrollIntoView');
    component.scrollToEvents();
    expect(mockElement.scrollIntoView).toHaveBeenCalled();
  });
});
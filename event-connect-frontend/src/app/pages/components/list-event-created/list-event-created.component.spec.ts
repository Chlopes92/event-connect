import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListEventCreatedComponent } from './list-event-created.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('ListEventCreatedComponent', () => {
  let component: ListEventCreatedComponent;
  let fixture: ComponentFixture<ListEventCreatedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListEventCreatedComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ListEventCreatedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

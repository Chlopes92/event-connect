import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { OrganizerHomePageComponent } from './organizer-home-page.component';

describe('OrganizerHomePageComponent', () => {
  let component: OrganizerHomePageComponent;
  let fixture: ComponentFixture<OrganizerHomePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrganizerHomePageComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(OrganizerHomePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

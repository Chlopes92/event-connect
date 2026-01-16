import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizerSignupPageComponent } from './organizer-signup-page.component';

describe('OrganizerSignupPageComponent', () => {
  let component: OrganizerSignupPageComponent;
  let fixture: ComponentFixture<OrganizerSignupPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
})
    .compileComponents();

    fixture = TestBed.createComponent(OrganizerSignupPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

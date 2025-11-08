import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizerLoginPageComponent } from './organizer-login-page.component';

describe('OrganizerLoginPageComponent', () => {
  let component: OrganizerLoginPageComponent;
  let fixture: ComponentFixture<OrganizerLoginPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrganizerLoginPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrganizerLoginPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

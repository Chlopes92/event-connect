import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientSignupPageComponent } from './client-signup-page.component';

describe('ClientSignupPageComponent', () => {
  let component: ClientSignupPageComponent;
  let fixture: ComponentFixture<ClientSignupPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientSignupPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientSignupPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

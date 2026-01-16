import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { ClientSignupPageComponent } from './client-signup-page.component';
import { provideRouter } from '@angular/router';

describe('ClientSignupPageComponent', () => {
  let component: ClientSignupPageComponent;
  let fixture: ComponentFixture<ClientSignupPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientSignupPageComponent]
      providers: [
        provideRouter([])
      ]
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

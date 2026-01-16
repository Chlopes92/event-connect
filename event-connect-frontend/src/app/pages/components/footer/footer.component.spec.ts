import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { FooterComponent } from './footer.component';

describe('FooterComponent', () => {
  let component: FooterComponent;
  let fixture: ComponentFixture<FooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FooterComponent],
      providers: [provideRouter([])]
    }).compileComponents();

    fixture = TestBed.createComponent(FooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have legal links disabled by default', () => {
    expect(component.legalEnabled).toBe(false);
    expect(component.privacyEnabled).toBe(false);
    expect(component.cgvEnabled).toBe(false);
    expect(component.contactEnabled).toBe(false);
    expect(component.savEnabled).toBe(false);
  });
});
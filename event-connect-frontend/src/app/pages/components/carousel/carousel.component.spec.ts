import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { CarouselComponent } from './carousel.component';
import { MatIconModule } from '@angular/material/icon';

describe('CarouselComponent', () => {
  let component: CarouselComponent;
  let fixture: ComponentFixture<CarouselComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarouselComponent, MatIconModule]
    }).compileComponents();

    fixture = TestBed.createComponent(CarouselComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => component.stopAutoPlay());

  // Création et initialisation
  it('should create and initialize correctly', () => {
    expect(component).toBeTruthy();
    expect(component.currentIndex).toBe(0);
    expect(component.particles.length).toBe(80);
  });

  it('should load slides on init', () => {
    fixture.detectChanges();
    expect(component.slides.length).toBeGreaterThan(0);
    expect(component.slides[0].title).toBeDefined();
    expect(component.slides[0].description).toBeDefined();
    expect(component.slides[0].image).toBeDefined();
  });

  // Particles
  it('should initialize particles with valid properties', () => {
    // Couvre les lignes 18-22 : création des particles
    expect(component.particles.length).toBe(80);
    component.particles.forEach(p => {
      expect(p.x).toBeDefined();
      expect(typeof p.x).toBe('number');
      expect(p.y).toBeDefined();
      expect(typeof p.y).toBe('number');
      expect(p.delay).toBeGreaterThanOrEqual(0);
      expect(p.delay).toBeLessThan(4);
    });
  });

  it('should use window dimensions for particles when available', () => {
    // Couvre la branche globalThis.window !== undefined
    const newComponent = new CarouselComponent();
    expect(newComponent.particles[0].x).toBeLessThanOrEqual(window.innerWidth || 1200);
    expect(newComponent.particles[0].y).toBeLessThanOrEqual(window.innerHeight || 800);
  });

  it('should handle nullish coalescing for image fallback', () => {
    // Couvre ligne 31 : image ?? 'assets/default-event.jpg'
    fixture.detectChanges();
    component.slides.forEach(slide => {
      expect(slide.image).toBeTruthy();
      expect(typeof slide.image).toBe('string');
    });
  });

  // Getters
  it('should return current and visible slides', () => {
    fixture.detectChanges();
    expect(component.currentSlide).toEqual(component.slides[0]);
    expect(component.visibleSlides.length).toBe(4);
  });

  // Navigation
  it('should navigate to next and previous slides', fakeAsync(() => {
    fixture.detectChanges();
    component.nextSlide();
    tick(600);
    expect(component.currentIndex).toBe(1);
    
    component.previousSlide();
    tick(600);
    expect(component.currentIndex).toBe(0);
  }));

  it('should wrap slides at boundaries', fakeAsync(() => {
    fixture.detectChanges();
    component.currentIndex = component.slides.length - 1;
    component.nextSlide();
    tick(600);
    expect(component.currentIndex).toBe(0);
  }));

  it('should block navigation when transitioning', fakeAsync(() => {
    fixture.detectChanges();
    component.isTransitioning = true;
    const index = component.currentIndex;
    
    // Couvre les 3 lignes "if (this.isTransitioning) return"
    component.nextSlide();
    expect(component.currentIndex).toBe(index);
    
    component.previousSlide();
    expect(component.currentIndex).toBe(index);
    
    component.goToSlide(2);
    tick(600);
    expect(component.currentIndex).toBe(index);
  }));

  it('should execute navigation when not transitioning', fakeAsync(() => {
    // Force la couverture des branches normales (sans early return)
    fixture.detectChanges();
    component.isTransitioning = false;
    
    component.nextSlide();
    tick(600);
    expect(component.currentIndex).toBe(1);
  }));

  it('should jump to slide correctly', fakeAsync(() => {
    fixture.detectChanges();
    component.goToSlide(2);
    tick(600);
    expect(component.currentIndex).toBe(2);
  }));

  it('should not jump to slide 0', fakeAsync(() => {
    fixture.detectChanges();
    const index = component.currentIndex;
    component.goToSlide(0);
    tick(600);
    expect(component.currentIndex).toBe(index);
  }));

  // Autoplay
  it('should manage autoplay lifecycle', fakeAsync(() => {
    fixture.detectChanges();
    component.startAutoPlay();
    expect(component.autoPlayInterval).toBeDefined();
    
    tick(10000);
    tick(600);
    expect(component.currentIndex).toBeGreaterThan(0);
    
    component.stopAutoPlay();
  }));

  it('should pause and resume autoplay', fakeAsync(() => {
    fixture.detectChanges();
    const index = component.currentIndex;
    
    component.pauseAutoPlay();
    component.startAutoPlay();
    tick(10000);
    tick(600);
    expect(component.currentIndex).toBe(index);
    
    component.resumeAutoPlay();
  }));

  it('should handle stopAutoPlay safely', () => {
    component.autoPlayInterval = undefined;
    expect(() => component.stopAutoPlay()).not.toThrow();
  });

  // Styles
  it('should calculate card styles correctly', () => {
    const style0 = component.getCardStyle(0);
    const style1 = component.getCardStyle(1);
    
    expect(style0.transform).toBe('translateX(0px) scale(1)');
    expect(style0.zIndex).toBe(10);
    expect(style0.boxShadow).toContain('0 8px 32px');
    
    expect(style1.transform).toBe('translateX(350px) scale(0.92)');
    expect(style1.zIndex).toBe(9);
    expect(style1.boxShadow).toContain('0 2px 8px');
  });

  // Cleanup
  it('should cleanup on destroy', () => {
    spyOn(component, 'stopAutoPlay');
    component.ngOnDestroy();
    expect(component.stopAutoPlay).toHaveBeenCalled();
  });
});
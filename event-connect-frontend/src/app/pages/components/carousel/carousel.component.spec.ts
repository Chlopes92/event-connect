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

  // Test des méthodes privées via spy
  it('should use getViewportWidth for particle x coordinates', () => {
    spyOn<any>(component, 'getViewportWidth').and.returnValue(1200);
    
    const newComponent = new CarouselComponent();
    // La méthode sera appelée lors de la création des particles
    expect(newComponent.particles[0].x).toBeLessThanOrEqual(1200);
  });

  it('should use getViewportHeight for particle y coordinates', () => {
    spyOn<any>(component, 'getViewportHeight').and.returnValue(800);
    
    const newComponent = new CarouselComponent();
    expect(newComponent.particles[0].y).toBeLessThanOrEqual(800);
  });

  it('should call getEventImage when loading slides', () => {
    spyOn<any>(component, 'getEventImage').and.returnValue('test-image.jpg');
    
    component.ngOnInit();
    
    expect(component['getEventImage']).toHaveBeenCalled();
  });

  // Test getViewportWidth
  it('should return window.innerWidth when window is defined', () => {
    const width = component['getViewportWidth']();
    expect(width).toBe(window.innerWidth);
  });

  // Test getViewportHeight
  it('should return window.innerHeight when window is defined', () => {
    const height = component['getViewportHeight']();
    expect(height).toBe(window.innerHeight);
  });

  // Test getEventImage avec image définie
  it('should return image when image is provided', () => {
    const result = component['getEventImage']('test-image.jpg');
    expect(result).toBe('test-image.jpg');
  });

  // Test getEventImage avec null
  it('should return default image when image is null', () => {
    const result = component['getEventImage'](null);
    expect(result).toBe('assets/default-event.jpg');
  });

  // Test getEventImage avec undefined
  it('should return default image when image is undefined', () => {
    const result = component['getEventImage'](undefined);
    expect(result).toBe('assets/default-event.jpg');
  });

  // Test getEventImage avec chaîne vide
  it('should return default image when image is empty string', () => {
    const result = component['getEventImage']('');
    expect(result).toBe('assets/default-event.jpg');
  });

  // Particles
  it('should initialize particles with valid properties', () => {
    expect(component.particles.length).toBe(80);
    component.particles.forEach((p: { x: number; y: number; delay: number }) => {
      expect(p.x).toBeDefined();
      expect(typeof p.x).toBe('number');
      expect(p.y).toBeDefined();
      expect(typeof p.y).toBe('number');
      expect(p.delay).toBeGreaterThanOrEqual(0);
      expect(p.delay).toBeLessThan(4);
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

  it('should wrap to last slide when going previous from first slide', fakeAsync(() => {
    fixture.detectChanges();
    expect(component.currentIndex).toBe(0);
    
    component.previousSlide();
    tick(600);
    
    expect(component.currentIndex).toBe(component.slides.length - 1);
  }));

  it('should decrement index when not at first slide', fakeAsync(() => {
    fixture.detectChanges();
    component.currentIndex = 2;
    
    component.previousSlide();
    tick(600);
    
    expect(component.currentIndex).toBe(1);
  }));

  it('should test both branches of previousSlide ternary operator', fakeAsync(() => {
    fixture.detectChanges();
    
    // Branche 1: currentIndex === 0
    component.currentIndex = 0;
    component.previousSlide();
    tick(600);
    expect(component.currentIndex).toBe(component.slides.length - 1);
    
    // Branche 2: currentIndex !== 0
    component.currentIndex = 3;
    component.previousSlide();
    tick(600);
    expect(component.currentIndex).toBe(2);
  }));

  it('should wrap slides at boundaries when going forward', fakeAsync(() => {
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
    
    component.nextSlide();
    expect(component.currentIndex).toBe(index);
    
    component.previousSlide();
    expect(component.currentIndex).toBe(index);
    
    component.goToSlide(2);
    tick(600);
    expect(component.currentIndex).toBe(index);
  }));

  it('should execute navigation when not transitioning', fakeAsync(() => {
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
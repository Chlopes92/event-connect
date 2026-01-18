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

  afterEach(() => {
    component.stopAutoPlay();
  });

  // Tests de base
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.currentIndex).toBe(0);
    expect(component.isTransitioning).toBe(false);
    expect(component.particles.length).toBe(80);
  });

  // Cycle de vie
  it('should load slides on init', () => {
    fixture.detectChanges();
    expect(component.slides.length).toBeGreaterThan(0);
  });

  it('should cleanup on destroy', () => {
    spyOn(component, 'stopAutoPlay');
    component.ngOnDestroy();
    expect(component.stopAutoPlay).toHaveBeenCalled();
  });

  // Getters
  it('should return current slide', () => {
    fixture.detectChanges();
    expect(component.currentSlide).toEqual(component.slides[0]);
  });

  it('should return 4 visible slides', () => {
    fixture.detectChanges();
    expect(component.visibleSlides.length).toBe(4);
  });

  // Navigation
  it('should go to next slide', fakeAsync(() => {
    fixture.detectChanges();
    component.nextSlide();
    tick(600);
    expect(component.currentIndex).toBe(1);
  }));

  it('should go to previous slide', fakeAsync(() => {
    fixture.detectChanges();
    component.currentIndex = 2;
    component.previousSlide();
    tick(600);
    expect(component.currentIndex).toBe(1);
  }));

  it('should wrap to 0 on next from last slide', fakeAsync(() => {
    fixture.detectChanges();
    component.currentIndex = component.slides.length - 1;
    component.nextSlide();
    tick(600);
    expect(component.currentIndex).toBe(0);
  }));

  it('should wrap to last on previous from first slide', fakeAsync(() => {
    fixture.detectChanges();
    component.currentIndex = 0;
    component.previousSlide();
    tick(600);
    expect(component.currentIndex).toBe(component.slides.length - 1);
  }));

  it('should not navigate if transitioning', fakeAsync(() => {
    fixture.detectChanges();
    component.isTransitioning = true;
    const initialIndex = component.currentIndex;
    component.nextSlide();
    tick(600);
    expect(component.currentIndex).toBe(initialIndex);
  }));

  it('should jump to slide', fakeAsync(() => {
    fixture.detectChanges();
    component.goToSlide(2);
    tick(600);
    expect(component.currentIndex).toBe(2);
  }));

  it('should not jump to slide if index is 0', fakeAsync(() => {
    fixture.detectChanges();
    const initialIndex = component.currentIndex;
    component.goToSlide(0);
    tick(600);
    expect(component.currentIndex).toBe(initialIndex);
  }));

  // Autoplay
  it('should start autoplay', () => {
    fixture.detectChanges();
    component.startAutoPlay();
    expect(component.autoPlayInterval).toBeDefined();
  });

  it('should stop autoplay', () => {
    component.autoPlayInterval = setInterval(() => {}, 1000);
    spyOn(window, 'clearInterval');
    component.stopAutoPlay();
    expect(window.clearInterval).toHaveBeenCalled();
  });

  it('should pause autoplay', () => {
    component.pauseAutoPlay();
    expect(component.isAutoPlayPaused).toBe(true);
  });

  it('should resume autoplay', () => {
    component.isAutoPlayPaused = true;
    component.resumeAutoPlay();
    expect(component.isAutoPlayPaused).toBe(false);
  });

  it('should not advance slide when paused', fakeAsync(() => {
    fixture.detectChanges();
    component.isAutoPlayPaused = true;
    const initialIndex = component.currentIndex;
    component.startAutoPlay();
    tick(10000);
    tick(600);
    expect(component.currentIndex).toBe(initialIndex);
  }));

  // Styles
  it('should return correct style for first card', () => {
    const style = component.getCardStyle(0);
    expect(style.transform).toBe('translateX(0px) scale(1)');
    expect(style.zIndex).toBe(10);
    expect(style.boxShadow).toContain('0 8px 32px');
  });

  it('should return correct style for other cards', () => {
    const style = component.getCardStyle(1);
    expect(style.transform).toBe('translateX(350px) scale(0.92)');
    expect(style.zIndex).toBe(9);
    expect(style.boxShadow).toContain('0 2px 8px');
  });

  it('should calculate offset and scale correctly', () => {
    const style = component.getCardStyle(2);
    expect(style.transform).toContain('translateX(700px)');
    expect(style.transform).toContain('scale(0.84)');
  });
});
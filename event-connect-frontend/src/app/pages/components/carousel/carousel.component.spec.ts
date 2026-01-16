import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { CarouselComponent } from './carousel.component';

describe('CarouselComponent', () => {
  let component: CarouselComponent;
  let fixture: ComponentFixture<CarouselComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarouselComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(CarouselComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    component.stopAutoPlay();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize slides from mock data', () => {
    expect(component.slides.length).toBeGreaterThan(0);
  });

  it('should get current slide', () => {
    expect(component.currentSlide).toBeDefined();
    expect(component.currentSlide).toBe(component.slides[0]);
  });

  it('should get visible slides', () => {
    const visible = component.visibleSlides;
    expect(visible.length).toBe(4);
  });

  it('should navigate to next slide', fakeAsync(() => {
    const initialIndex = component.currentIndex;
    component.nextSlide();
    tick(600);
    expect(component.currentIndex).toBe((initialIndex + 1) % component.slides.length);
  }));

  it('should navigate to previous slide', fakeAsync(() => {
    component.currentIndex = 1;
    component.previousSlide();
    tick(600);
    expect(component.currentIndex).toBe(0);
  }));

  it('should go to specific slide', fakeAsync(() => {
    component.goToSlide(2);
    tick(600);
    expect(component.currentIndex).toBe(2);
  }));

  it('should not allow transition when already transitioning', fakeAsync(() => {
    component.isTransitioning = true;
    const initialIndex = component.currentIndex;
    
    component.nextSlide();
    tick(600);
    
    expect(component.currentIndex).toBe(initialIndex);
  }));

  it('should pause autoplay', () => {
    component.pauseAutoPlay();
    expect(component.isAutoPlayPaused).toBe(true);
  });

  it('should resume autoplay', () => {
    component.isAutoPlayPaused = true;
    component.resumeAutoPlay();
    expect(component.isAutoPlayPaused).toBe(false);
  });

  it('should return card style with correct transform', () => {
    const style = component.getCardStyle(0);
    expect(style.transform).toContain('translateX');
    expect(style.transform).toContain('scale');
  });

  it('should handle wrap around when going previous from first slide', fakeAsync(() => {
    component.currentIndex = 0;
    component.previousSlide();
    tick(600);
    expect(component.currentIndex).toBe(component.slides.length - 1);
  }));

  it('should start autoplay on init', () => {
    expect(component.autoPlayInterval).toBeDefined();
  });

  it('should cleanup autoplay on destroy', () => {
    spyOn(window, 'clearInterval');
    component.ngOnDestroy();
    expect(window.clearInterval).toHaveBeenCalled();
  });
});
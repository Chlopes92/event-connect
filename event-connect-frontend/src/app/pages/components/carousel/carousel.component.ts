import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { EventCard, EVENTS_MOCK } from '../../../mocks/events.mock';

@Component({
  selector: 'app-carousel',
  imports: [MatIconModule, CommonModule],
  templateUrl: './carousel.component.html',
  styleUrl: './carousel.component.css'
})
export class CarouselComponent implements OnInit, OnDestroy {
  currentIndex = 0;
  isTransitioning = false;
  autoPlayInterval: any;
  isAutoPlayPaused = false;
  
  particles = Array.from({ length: 80 }, () => ({
    x: Math.random() * (typeof globalThis.window !== 'undefined' ? window.innerWidth : 1200),
    y: Math.random() * (typeof globalThis.window !== 'undefined' ? window.innerHeight : 800),
    delay: Math.random() * 4
  }));

  slides: { title: string; description: string; image: string }[] = [];

  ngOnInit() {
    // On transforme ton mock pour qu’il colle au format attendu par le carousel
    this.slides = EVENTS_MOCK.map((event: EventCard) => ({
      title: event.title,
      description: event.description,
      image: event.image ?? 'assets/default-event.jpg' // fallback si pas d’image
    }));

    this.startAutoPlay();
  }

  ngOnDestroy() {
    this.stopAutoPlay();
  }

  get currentSlide() {
    return this.slides[this.currentIndex];
  }

  get visibleSlides() {
    const visible = [];
    for (let i = 1; i <= 4; i++) {
      const index = (this.currentIndex + i) % this.slides.length;
      visible.push(this.slides[index]);
    }
    return visible;
  }

  nextSlide() {
    if (this.isTransitioning) return;
    
    this.isTransitioning = true;
    
    setTimeout(() => {
      this.currentIndex = (this.currentIndex + 1) % this.slides.length;
      this.isTransitioning = false;
    }, 600);
  }

  previousSlide() {
    if (this.isTransitioning) return;
    
    this.isTransitioning = true;
    
    setTimeout(() => {
      this.currentIndex = this.currentIndex === 0 ? this.slides.length - 1 : this.currentIndex - 1;
      this.isTransitioning = false;
    }, 600);
  }

  goToSlide(cardIndex: number) {
    if (this.isTransitioning || cardIndex === 0) return;
    
    this.isTransitioning = true;
    
    setTimeout(() => {
      this.currentIndex = (this.currentIndex + cardIndex) % this.slides.length;
      this.isTransitioning = false;
    }, 600);
  }

  startAutoPlay() {
    this.autoPlayInterval = setInterval(() => {
      if (!this.isAutoPlayPaused && !this.isTransitioning) {
        this.nextSlide();
      }
    }, 10000);
  }

  stopAutoPlay() {
    if (this.autoPlayInterval) {
      clearInterval(this.autoPlayInterval);
    }
  }

  pauseAutoPlay() {
    this.isAutoPlayPaused = true;
  }

  resumeAutoPlay() {
    this.isAutoPlayPaused = false;
  }

  getCardStyle(index: number) {
    const offset = index * 350;  // DÃ©calage horizontal
    const scale = 1 - index * 0.08; // Plus on est loin, plus c'est petit
    const zIndex = 10 - index;
    return {
      transform: `translateX(${offset}px) scale(${scale})`,
      zIndex,
      boxShadow: index === 0 
        ? '0 8px 32px rgba(0,0,0,0.22), 0 2px 8px rgba(0,0,0,0.12)'
        : '0 2px 8px rgba(0,0,0,0.10)'
    };
  }
}

import { Component } from '@angular/core';
import { CarouselComponent } from '../components/carousel/carousel.component';
import { EventCardComponent } from '../components/event-card/event-card.component';

@Component({
  selector: 'app-home-page',
  imports: [CarouselComponent, EventCardComponent],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css'
})
export class HomePageComponent {

}

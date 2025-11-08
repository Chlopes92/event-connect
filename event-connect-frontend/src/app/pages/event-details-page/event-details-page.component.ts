import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EventService } from '../../services/event/event.service';
import { Event } from '../../shared/models/Event';

@Component({
  selector: 'app-event-details-page',
  imports: [CommonModule],
  templateUrl: './event-details-page.component.html',
  styleUrl: './event-details-page.component.css'
})
export class EventDetailsPageComponent implements OnInit{
 event!: Event;

 constructor(
    public activatedRoute: ActivatedRoute, 
    private eventService:EventService,
    private router:Router
  ) {}

 ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      const id = Number(params['id']); // 🔹 conversion en number
      if (id) {
        this.eventService.getEventById(id).subscribe({
          next: (event) => {
            this.event = event;
            console.log('Event récupéré :', this.event);
          },
          error: (err) => {
            console.error('Erreur lors du chargement de l’événement :', err);
            this.router.navigate(['/']); // 🔹 redirige si erreur
          }
        });
      }
    });
  }

  goBack() {
    window.history.back(); // Navigation vers la page précédente
  }

}

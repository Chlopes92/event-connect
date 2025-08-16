import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

interface Event {
  id: number;
  title: string;
  price: string;
  image: string;
  date: string;
  location: string;
  category: string;
  description: string;
}

@Component({
  selector: 'app-list-event-created',
  imports: [],
  templateUrl: './list-event-created.component.html',
  styleUrl: './list-event-created.component.css'
})
export class ListEventCreatedComponent implements OnInit {
  events: Event[] = [
    {
      id: 1,
      title: 'Titre Event',
      price: 'Prix',
      image: 'https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=400',
      date: '2024-02-15',
      location: 'Paris, France',
      category: 'Conférence',
      description: 'Description de l\'événement...'
    },
    {
      id: 2,
      title: 'Titre Event',
      price: 'Prix',
      image: 'https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg?auto=compress&cs=tinysrgb&w=400',
      date: '2024-02-20',
      location: 'Lyon, France',
      category: 'Formation',
      description: 'Description de l\'événement...'
    },
    {
      id: 3,
      title: 'Titre Event',
      price: 'Prix',
      image: 'https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg?auto=compress&cs=tinysrgb&w=400',
      date: '2024-02-25',
      location: 'Marseille, France',
      category: 'Atelier',
      description: 'Description de l\'événement...'
    }
  ];

  constructor(private router: Router) {}

  ngOnInit() {}

  editEvent(eventId: number) {
    console.log('Éditer l\'événement:', eventId);
    // Navigation vers le formulaire d'édition
  }

  deleteEvent(eventId: number) {
    console.log('Supprimer l\'événement:', eventId);
    this.events = this.events.filter(event => event.id !== eventId);
  }

  createNewEvent() {
    // Navigation vers le formulaire de création
    this.router.navigate(['/create-event']);
  }
}
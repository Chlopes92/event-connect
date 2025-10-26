import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { CategoryService } from '../../../services/category/category.service';
import { Category } from '../../../shared/models/Category';


interface Event {
  id: number;
  title: string;
  address: string;
  date: string;
  price: string;
  categoryId: string;
  image: string;
  isFree: boolean;
}

interface Filter {
  id: string;
  label: string;
  active: boolean;
}

@Component({
  selector: 'app-event-card',
  imports: [CommonModule],
  templateUrl: './event-card.component.html',
  styleUrl: './event-card.component.css'
})
export class EventCardComponent {

  categories: Category[] = []; 
  filters: Filter[] = [];

  private categoryService = inject(CategoryService);

  ngOnInit(): void {
    this.loadCategories();
  }

  private loadCategories(): void {
    this.categoryService.getAllCategories().subscribe((data: Category[]) => {
      this.categories = data;

      this.filters = [
        { id: 'tous', label: 'Tout', active: true },
        ...this.categories.map(category => ({
          id: String(category.id), // Converti en string
          label: category.nameCategory, // Correction ici
          active: false
        }))
      ];
    });
  }
  
  
  events: Event[] = [
    {
      id: 1,
      title: 'Titre Event',
      address: 'Adresse Event',
      date: '12/04',
      price: '20,00 €',
      categoryId: '2',
      image: 'https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=400',
      isFree: false
    },
    {
      id: 2,
      title: 'Titre Event',
      address: 'Adresse Event',
      date: '15/04',
      price: 'Gratuit',
      categoryId: '1',
      image: 'https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg?auto=compress&cs=tinysrgb&w=400',
      isFree: true
    },
    {
      id: 3,
      title: 'Titre Event',
      address: 'Adresse Event',
      date: '18/04',
      price: 'Gratuit',
      categoryId: '6',
      image: 'https://images.pexels.com/photos/2581922/pexels-photo-2581922.jpeg?auto=compress&cs=tinysrgb&w=400',
      isFree: true
    },
    {
      id: 4,
      title: 'Titre Event',
      address: 'Adresse Event',
      date: '18/04',
      price: '10,00 €',
      categoryId: '2',
      image: 'https://images.pexels.com/photos/1190303/pexels-photo-1190303.jpeg?auto=compress&cs=tinysrgb&w=400',
      isFree: false
    },
    {
      id: 5,
      title: 'Titre Event',
      address: 'Adresse Event',
      date: '24/04',
      price: '5,00 €',
      categoryId: '2',
      image: 'https://images.pexels.com/photos/2070033/pexels-photo-2070033.jpeg?auto=compress&cs=tinysrgb&w=400',
      isFree: false
    },
    {
      id: 6,
      title: 'Titre Event',
      address: 'Adresse Event',
      date: '30/04',
      price: '15,00 €',
      categoryId: '7',
      image: 'https://images.pexels.com/photos/3945313/pexels-photo-3945313.jpeg?auto=compress&cs=tinysrgb&w=400',
      isFree: false
    }
  ];

  get filteredEvents(): Event[] {
    const activeFilter = this.filters.find(f => f.active);
    if (!activeFilter || activeFilter.id === 'tous') {
      return this.events;
    }
    return this.events.filter(event => event.categoryId === activeFilter.id);
  }
  
 getCategoryName(categoryId: string): string {
  return this.categories.find(category => String(category.id) === categoryId)?.nameCategory || '';
}

  toggleFilter(filterId: string): void {
    this.filters.forEach(filter => {
      filter.active = filter.id === filterId;
    });
  }

  shareEvent(event: Event): void {
    console.log('Sharing event:', event.title);
    // Implement share functionality
  }

  toggleFavorite(event: Event): void {
    console.log('Toggle favorite for:', event.title);
    // Implement favorite functionality
  }

  loadMoreEvents(): void {
    console.log('Loading more events...');
    // Implement load more functionality
  }

}

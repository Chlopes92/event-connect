import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { Event } from '../../../shared/models/Event';
import { EventService } from '../../../services/event/event.service';
import { ShareService } from '../../../services/share/share.service';

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
  @Input() events: Event[] = [];
  @Input() activeCategoryLabel: string = '';

  private shareService = inject(ShareService);
  private eventService = inject(EventService);

  /** Partager un événement */
  async shareEvent(event: Event, $event: MouseEvent): Promise<void> {
    // Empêcher la navigation vers event-details
    $event.preventDefault();
    $event.stopPropagation();

    const shareData = {
      title: event.nameEvent,
      text: `Découvrez cet événement : ${event.nameEvent}\n${event.address}\nLe ${new Date(event.dateEvent).toLocaleDateString('fr-FR')}`,
      url: `${window.location.origin}/event-details/${event.id}`
    };

    await this.shareService.share(shareData);
  }

  getImageUrl(filename: string | undefined): string {
    return this.eventService.getImageUrl(filename);
  }

  /** Gérer les favoris */
  toggleFavorite(event: Event, $event: MouseEvent): void {
    // Empêcher la navigation vers event-details
    $event.preventDefault();
    $event.stopPropagation();
  
  }
}

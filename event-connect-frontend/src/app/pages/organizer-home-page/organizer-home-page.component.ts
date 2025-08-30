import { Component } from '@angular/core';
import { ListEventCreatedComponent } from '../components/list-event-created/list-event-created.component';

@Component({
  selector: 'app-organizer-home-page',
  imports: [ListEventCreatedComponent],
  templateUrl: './organizer-home-page.component.html',
  styleUrl: './organizer-home-page.component.css'
})
export class OrganizerHomePageComponent {

}

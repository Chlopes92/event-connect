import { Component } from '@angular/core';
import { ListEventCreatedComponent } from '../components/list-event-created/list-event-created.component';

@Component({
  selector: 'app-organizer-home',
  imports: [ListEventCreatedComponent],
  templateUrl: './organizer-home.component.html',
  styleUrl: './organizer-home.component.css'
})
export class OrganizerHomeComponent {

}

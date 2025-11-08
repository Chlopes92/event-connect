import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EVENT_URL } from '../../shared/constants/urls';
import { Event } from '../../shared/models/Event';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  
  private http = inject(HttpClient);

  getAllEvents(): Observable<Event[]> {
    return this.http.get<Event[]>(`${EVENT_URL}`);
  }

  getEventById(id: number): Observable<Event> {
    return this.http.get<Event>(`${EVENT_URL}/${id}`);
  }
}

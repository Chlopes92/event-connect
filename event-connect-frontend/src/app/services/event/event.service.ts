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

  /** GET all events */
  getAllEvents(): Observable<Event[]> {
    return this.http.get<Event[]>(`${EVENT_URL}`);
  }

  /** GET event by id */
  getEventById(id: number): Observable<Event> {
    return this.http.get<Event>(`${EVENT_URL}/${id}`);
  }

  /** GET events by category */
  getEventsByCategory(categoryId: number): Observable<Event[]> {
    return this.http.get<Event[]>(`${EVENT_URL}/by-category/${categoryId}`);
  }

  /** CREATE event */
  createEvent(event: Event): Observable<string> {
    return this.http.post<string>(`${EVENT_URL}`, event);
  }

  /** UPDATE event */
  updateEvent(id: number, event: Event): Observable<string> {
    return this.http.put<string>(`${EVENT_URL}/${id}`, event);
  }

  /** DELETE event */
  deleteEvent(id: number): Observable<string> {
    return this.http.delete<string>(`${EVENT_URL}/${id}`);
  }
}

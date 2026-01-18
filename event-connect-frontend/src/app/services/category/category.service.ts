import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CATEGORY_URL } from '../../shared/constants/urls';
import { Category } from '../../shared/models/Category';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  readonly http = inject(HttpClient);

  getAllCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${CATEGORY_URL}`);
  }
}

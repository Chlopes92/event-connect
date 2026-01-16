import { TestBed } from '@angular/core/testing';

import { CategoryService } from './category.service';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Category } from '../../shared/models/Category';
import { provideHttpClient } from '@angular/common/http';
import { CATEGORY_URL } from '../../shared/constants/urls';

describe('CategoryService', () => {
  let service: CategoryService;
  let httpMock: HttpTestingController;

  const mockCategories: Category[] = [
    { id: 1, nameCategory: 'Festival' },
    { id: 2, nameCategory: 'Concert' }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CategoryService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    
    service = TestBed.inject(CategoryService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve all categories', () => {
    service.getAllCategories().subscribe(categories => {
      expect(categories).toEqual(mockCategories);
      expect(categories.length).toBe(2);
    });

    const req = httpMock.expectOne(CATEGORY_URL);
    expect(req.request.method).toBe('GET');
    req.flush(mockCategories);
  });
});
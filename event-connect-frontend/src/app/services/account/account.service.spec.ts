import { TestBed } from '@angular/core/testing';

import { AccountService } from './account.service';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Role } from '../../shared/models/Role';
import { Profile, ProfileLogin } from '../../shared/models/Profile';
import { provideHttpClient } from '@angular/common/http';
import { PROFILE_URL, ROLE_URL } from '../../shared/constants/urls';

describe('AccountService', () => {
  let service: AccountService;
  let httpMock: HttpTestingController;

  const mockRoles: Role[] = [
    { id: 1, name: 'ROLE_USER' },
    { id: 2, name: 'ROLE_ADMIN' }
  ];

  const mockProfile: Profile = {
    lastName: 'Doe',
    firstName: 'John',
    email: 'john@example.com',
    password: 'password123',
    phone: '0612345678',
    role: { id: 1, name: 'CLIENT' }
  };

  const mockCredentials: ProfileLogin = {
    email: 'john@example.com',
    password: 'password123'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AccountService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    
    service = TestBed.inject(AccountService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve all roles', () => {
    service.getRoles().subscribe(roles => {
      expect(roles).toEqual(mockRoles);
      expect(roles.length).toBe(2);
    });

    const req = httpMock.expectOne(ROLE_URL);
    expect(req.request.method).toBe('GET');
    req.flush(mockRoles);
  });

  it('should signup a new user', () => {
    service.signup(mockProfile).subscribe(response => {
      expect(response.status).toBe(201);
    });

    const req = httpMock.expectOne(PROFILE_URL);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockProfile);
    req.flush(null, { status: 201, statusText: 'Created' });
  });

  it('should login and return token', () => {
    const mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
    
    service.login(mockCredentials).subscribe(token => {
      expect(token).toBe(mockToken);
    });

    const req = httpMock.expectOne(`${PROFILE_URL}/authenticate`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockCredentials);
    req.flush(mockToken);
  });

  it('should handle 401 error on invalid credentials', () => {
    service.login(mockCredentials).subscribe({
      next: () => fail('should have failed with 401'),
      error: (error) => {
        expect(error.message).toContain('Email ou mot de passe incorrect');
      }
    });

    const req = httpMock.expectOne(`${PROFILE_URL}/authenticate`);
    req.flush('Unauthorized', { status: 401, statusText: 'Unauthorized' });
  });

  it('should handle 409 error on duplicate email', () => {
    service.signup(mockProfile).subscribe({
      next: () => fail('should have failed with 409'),
      error: (error) => {
        expect(error.message).toContain('Email ou téléphone déjà utilisé');
      }
    });

    const req = httpMock.expectOne(PROFILE_URL);
    req.flush('Conflict', { status: 409, statusText: 'Conflict' });
  });
});
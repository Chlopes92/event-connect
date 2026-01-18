import { TestBed } from '@angular/core/testing';
import { HttpClient, HttpErrorResponse, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { authInterceptor } from './auth.interceptor';
import Swal from 'sweetalert2';

describe('authInterceptor', () => {
  let httpClient: HttpClient;
  let httpMock: HttpTestingController;
  let router: Router;
  let localStorageSpy: jasmine.SpyObj<Storage>;

  const TEST_URL = 'https://api.test.com/data';

  beforeEach(() => {
    // Mock localStorage
    localStorageSpy = jasmine.createSpyObj('localStorage', ['getItem', 'removeItem', 'setItem']);
    Object.defineProperty(window, 'localStorage', {
      value: localStorageSpy,
      writable: true
    });

    // Mock Router
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting(),
        { provide: Router, useValue: routerSpy }
      ]
    });

    httpClient = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);

    // Mock Swal to avoid actual alerts
    spyOn(Swal, 'fire').and.returnValue(Promise.resolve({
      isConfirmed: true,
      isDenied: false,
      isDismissed: false
    } as any));
  });

  afterEach(() => {
    httpMock.verify();
    localStorageSpy.removeItem.calls.reset();
    (router.navigate as jasmine.Spy).calls.reset();
  });

  // ============================================
  // TESTS - TOKEN INJECTION
  // ============================================

  describe('Token Injection', () => {
    it('should add Authorization header when token exists', () => {
      const mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
      localStorageSpy.getItem.and.returnValue(mockToken);

      httpClient.get(TEST_URL).subscribe();

      const req = httpMock.expectOne(TEST_URL);
      expect(req.request.headers.has('Authorization')).toBe(true);
      expect(req.request.headers.get('Authorization')).toBe(`Bearer ${mockToken}`);
      req.flush({});
    });

    it('should NOT add Authorization header when no token exists', () => {
      localStorageSpy.getItem.and.returnValue(null);

      httpClient.get(TEST_URL).subscribe();

      const req = httpMock.expectOne(TEST_URL);
      expect(req.request.headers.has('Authorization')).toBe(false);
      req.flush({});
    });
  });

  // ============================================
  // TESTS - 401 UNAUTHORIZED
  // ============================================

  describe('401 Unauthorized Handling', () => {
    beforeEach(() => {
      jasmine.clock().install();
    });

    afterEach(() => {
      jasmine.clock().uninstall();
    });

    it('should handle 401 error and clear localStorage', () => {
      const mockToken = 'expired-token';
      localStorageSpy.getItem.and.returnValue(mockToken);

      httpClient.get(TEST_URL).subscribe({
        next: () => fail('should have failed'),
        error: (error: HttpErrorResponse) => {
          expect(error.status).toBe(401);
        }
      });

      const req = httpMock.expectOne(TEST_URL);
      req.flush(
        { message: 'Token expiré', status: 401 },
        { status: 401, statusText: 'Unauthorized' }
      );

      // Vérifier que localStorage est nettoyé
      expect(localStorageSpy.removeItem).toHaveBeenCalledWith('jwt');
      expect(localStorageSpy.removeItem).toHaveBeenCalledWith('userEmail');
      expect(localStorageSpy.removeItem).toHaveBeenCalledWith('userRole');
    });

    it('should show SweetAlert on 401 error', () => {
      localStorageSpy.getItem.and.returnValue('token');

      httpClient.get(TEST_URL).subscribe({
        next: () => fail('should have failed'),
        error: () => {}
      });

      const req = httpMock.expectOne(TEST_URL);
      req.flush(
        { message: 'Session expirée', status: 401 },
        { status: 401, statusText: 'Unauthorized' }
      );

      expect(Swal.fire).toHaveBeenCalledWith(jasmine.objectContaining({
        icon: 'warning',
        title: 'Session expirée',
        text: 'Session expirée'
      }));
    });

    it('should redirect to /home after 401 error', () => {
      localStorageSpy.getItem.and.returnValue('token');

      httpClient.get(TEST_URL).subscribe({
        next: () => fail('should have failed'),
        error: () => {}
      });

      const req = httpMock.expectOne(TEST_URL);
      req.flush(null, { status: 401, statusText: 'Unauthorized' });

      // Avancer le temps de 2000ms
      jasmine.clock().tick(2001);

      expect(router.navigate).toHaveBeenCalledWith(['/home']);
    });

    it('should use default message when backend provides none', () => {
      localStorageSpy.getItem.and.returnValue('token');

      httpClient.get(TEST_URL).subscribe({
        next: () => fail('should have failed'),
        error: () => {}
      });

      const req = httpMock.expectOne(TEST_URL);
      req.flush(null, { status: 401, statusText: 'Unauthorized' });

      expect(Swal.fire).toHaveBeenCalledWith(jasmine.objectContaining({
        text: 'Votre session a expiré. Veuillez vous reconnecter.'
      }));
    });
  });

  // ============================================
  // TESTS - 403 FORBIDDEN
  // ============================================

  describe('403 Forbidden Handling', () => {
    it('should show SweetAlert on 403 error', () => {
      localStorageSpy.getItem.and.returnValue('token');

      httpClient.get(TEST_URL).subscribe({
        next: () => fail('should have failed'),
        error: (error: HttpErrorResponse) => {
          expect(error.status).toBe(403);
        }
      });

      const req = httpMock.expectOne(TEST_URL);
      req.flush(
        { message: 'Accès refusé', status: 403 },
        { status: 403, statusText: 'Forbidden' }
      );

      expect(Swal.fire).toHaveBeenCalledWith(jasmine.objectContaining({
        icon: 'error',
        title: 'Accès refusé',
        text: 'Accès refusé'
      }));
    });

    it('should use default message for 403 when backend provides none', () => {
      localStorageSpy.getItem.and.returnValue('token');

      httpClient.get(TEST_URL).subscribe({
        next: () => fail('should have failed'),
        error: () => {}
      });

      const req = httpMock.expectOne(TEST_URL);
      req.flush(null, { status: 403, statusText: 'Forbidden' });

      expect(Swal.fire).toHaveBeenCalledWith(jasmine.objectContaining({
        text: 'Accès refusé. Vous n\'avez pas les permissions nécessaires.'
      }));
    });
  });

  // ============================================
  // TESTS - 404 NOT FOUND
  // ============================================

  describe('404 Not Found Handling', () => {
    it('should log warning on 404 error', () => {
      spyOn(console, 'warn');
      localStorageSpy.getItem.and.returnValue('token');

      httpClient.get(TEST_URL).subscribe({
        next: () => fail('should have failed'),
        error: (error: HttpErrorResponse) => {
          expect(error.status).toBe(404);
        }
      });

      const req = httpMock.expectOne(TEST_URL);
      req.flush(
        { message: 'Ressource non trouvée', status: 404 },
        { status: 404, statusText: 'Not Found' }
      );

      expect(console.warn).toHaveBeenCalledWith(
        '⚠️ Erreur 404 : Ressource non trouvée'
      );
    });
  });

  // ============================================
  // TESTS - 409 CONFLICT
  // ============================================

  describe('409 Conflict Handling', () => {
    it('should log warning on 409 error', () => {
      spyOn(console, 'warn');
      localStorageSpy.getItem.and.returnValue('token');

      httpClient.get(TEST_URL).subscribe({
        next: () => fail('should have failed'),
        error: (error: HttpErrorResponse) => {
          expect(error.status).toBe(409);
        }
      });

      const req = httpMock.expectOne(TEST_URL);
      req.flush(
        { message: 'Ressource déjà existante', status: 409 },
        { status: 409, statusText: 'Conflict' }
      );

      expect(console.warn).toHaveBeenCalledWith(
        '⚠️ Erreur 409 : Conflit (ressource dupliquée)'
      );
    });
  });

  // ============================================
  // TESTS - 500 SERVER ERROR
  // ============================================

  describe('500 Server Error Handling', () => {
    it('should show SweetAlert on 500 error', () => {
      localStorageSpy.getItem.and.returnValue('token');

      httpClient.get(TEST_URL).subscribe({
        next: () => fail('should have failed'),
        error: (error: HttpErrorResponse) => {
          expect(error.status).toBe(500);
        }
      });

      const req = httpMock.expectOne(TEST_URL);
      req.flush(
        { message: 'Erreur serveur', status: 500 },
        { status: 500, statusText: 'Internal Server Error' }
      );

      expect(Swal.fire).toHaveBeenCalledWith(jasmine.objectContaining({
        icon: 'error',
        title: 'Erreur serveur',
        text: 'Erreur serveur'
      }));
    });

    it('should use default message for 500 when backend provides none', () => {
      localStorageSpy.getItem.and.returnValue('token');

      httpClient.get(TEST_URL).subscribe({
        next: () => fail('should have failed'),
        error: () => {}
      });

      const req = httpMock.expectOne(TEST_URL);
      req.flush(null, { status: 500, statusText: 'Internal Server Error' });

      expect(Swal.fire).toHaveBeenCalledWith(jasmine.objectContaining({
        text: 'Une erreur serveur est survenue. Veuillez réessayer plus tard.'
      }));
    });
  });

  // ============================================
  // TESTS - SUCCESSFUL REQUESTS
  // ============================================

  describe('Successful Requests', () => {
    it('should pass through successful requests without modification', () => {
      const mockData = { id: 1, name: 'Test' };
      localStorageSpy.getItem.and.returnValue('token');

      httpClient.get(TEST_URL).subscribe(data => {
        expect(data).toEqual(mockData);
      });

      const req = httpMock.expectOne(TEST_URL);
      expect(req.request.headers.get('Authorization')).toBe('Bearer token');
      req.flush(mockData);

      // Vérifier qu'aucun nettoyage n'a été fait
      expect(localStorageSpy.removeItem).not.toHaveBeenCalled();
      expect(router.navigate).not.toHaveBeenCalled();
    });
  });
});
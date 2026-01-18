import { TestBed } from '@angular/core/testing';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { authGuard, organizerGuard, clientGuard } from './auth.guard';

describe('Auth Guards', () => {
  let router: Router;
  let routerSpy: jasmine.SpyObj<Router>;
  let localStorageSpy: jasmine.SpyObj<Storage>;
  let mockRoute: ActivatedRouteSnapshot;
  let mockState: RouterStateSnapshot;

  beforeEach(() => {
    // Mock Router
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    
    // Mock localStorage
    localStorageSpy = jasmine.createSpyObj('localStorage', ['getItem', 'setItem', 'removeItem']);
    Object.defineProperty(window, 'localStorage', {
      value: localStorageSpy,
      writable: true
    });

    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: routerSpy }
      ]
    });

    router = TestBed.inject(Router);
    
    // Mock route and state
    mockRoute = {} as ActivatedRouteSnapshot;
    mockState = { url: '/some-path' } as RouterStateSnapshot;
  });

  afterEach(() => {
    localStorageSpy.getItem.calls.reset();
    localStorageSpy.setItem.calls.reset();
    routerSpy.navigate.calls.reset();
  });

  // ============================================
  // TESTS - authGuard (General Guard)
  // ============================================

  describe('authGuard', () => {
    
    describe('No Token Scenarios', () => {
      beforeEach(() => {
        localStorageSpy.getItem.and.returnValue(null);
      });

      it('should redirect to organizer-signup for organizer routes when no token', () => {
        mockState.url = '/organizer-dashboard';

        const result = TestBed.runInInjectionContext(() => 
          authGuard(mockRoute, mockState)
        );

        expect(result).toBe(false);
        expect(localStorageSpy.setItem).toHaveBeenCalledWith('redirectUrl', '/organizer-dashboard');
        expect(routerSpy.navigate).toHaveBeenCalledWith(['/organizer-signup']);
      });

      it('should redirect to client-signup for client routes when no token', () => {
        mockState.url = '/my-tickets';

        const result = TestBed.runInInjectionContext(() => 
          authGuard(mockRoute, mockState)
        );

        expect(result).toBe(false);
        expect(localStorageSpy.setItem).toHaveBeenCalledWith('redirectUrl', '/my-tickets');
        expect(routerSpy.navigate).toHaveBeenCalledWith(['/client-signup']);
      });

      // it('should redirect to organizer-signup for create-event route', () => {
      //   mockState.url = '/create-event';

      //   const result = TestBed.runInInjectionContext(() => 
      //     authGuard(mockRoute, mockState)
      //   );

      //   expect(result).toBe(false);
      //   expect(routerSpy.navigate).toHaveBeenCalledWith(['/organizer-signup']);
      // });

      // it('should redirect to organizer-signup for edit-event route', () => {
      //   mockState.url = '/edit-event/123';

      //   const result = TestBed.runInInjectionContext(() => 
      //     authGuard(mockRoute, mockState)
      //   );

      //   expect(result).toBe(false);
      //   expect(routerSpy.navigate).toHaveBeenCalledWith(['/organizer-signup']);
      // });
    });

    describe('With Valid Token', () => {
      beforeEach(() => {
        localStorageSpy.getItem.and.callFake((key: string) => {
          if (key === 'jwt') return 'valid-token';
          if (key === 'userRole') return 'ROLE_ADMIN';
          return null;
        });
      });

      it('should allow access to organizer routes with ROLE_ADMIN', () => {
        mockState.url = '/organizer-dashboard';

        const result = TestBed.runInInjectionContext(() => 
          authGuard(mockRoute, mockState)
        );

        expect(result).toBe(true);
        expect(routerSpy.navigate).not.toHaveBeenCalled();
      });

      it('should allow access to create-event with ROLE_ADMIN', () => {
        mockState.url = '/create-event';

        const result = TestBed.runInInjectionContext(() => 
          authGuard(mockRoute, mockState)
        );

        expect(result).toBe(true);
      });

      it('should allow access to edit-event with ROLE_ADMIN', () => {
        mockState.url = '/edit-event/123';

        const result = TestBed.runInInjectionContext(() => 
          authGuard(mockRoute, mockState)
        );

        expect(result).toBe(true);
      });
    });

    describe('Wrong Role Scenarios', () => {
      beforeEach(() => {
        localStorageSpy.getItem.and.callFake((key: string) => {
          if (key === 'jwt') return 'valid-token';
          if (key === 'userRole') return 'ROLE_USER'; // Client role
          return null;
        });
      });

      it('should redirect to home when ROLE_USER tries to access organizer route', () => {
        mockState.url = '/organizer-dashboard';

        const result = TestBed.runInInjectionContext(() => 
          authGuard(mockRoute, mockState)
        );

        expect(result).toBe(false);
        expect(routerSpy.navigate).toHaveBeenCalledWith(['/home']);
      });

      it('should redirect to home when ROLE_USER tries to create event', () => {
        mockState.url = '/create-event';

        const result = TestBed.runInInjectionContext(() => 
          authGuard(mockRoute, mockState)
        );

        expect(result).toBe(false);
        expect(routerSpy.navigate).toHaveBeenCalledWith(['/home']);
      });
    });

    describe('Client Routes', () => {
      beforeEach(() => {
        localStorageSpy.getItem.and.callFake((key: string) => {
          if (key === 'jwt') return 'valid-token';
          if (key === 'userRole') return 'ROLE_USER';
          return null;
        });
      });

      it('should allow client with ROLE_USER to access non-organizer routes', () => {
        mockState.url = '/my-tickets';

        const result = TestBed.runInInjectionContext(() => 
          authGuard(mockRoute, mockState)
        );

        expect(result).toBe(true);
        expect(routerSpy.navigate).not.toHaveBeenCalled();
      });
    });
  });

  // ============================================
  // TESTS - organizerGuard
  // ============================================

  describe('organizerGuard', () => {
    
    it('should redirect to organizer-signup when no token', () => {
      localStorageSpy.getItem.and.returnValue(null);
      mockState.url = '/organizer-dashboard';

      const result = TestBed.runInInjectionContext(() => 
        organizerGuard(mockRoute, mockState)
      );

      expect(result).toBe(false);
      expect(localStorageSpy.setItem).toHaveBeenCalledWith('redirectUrl', '/organizer-dashboard');
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/organizer-signup']);
    });

    it('should allow access with valid token and ROLE_ADMIN', () => {
      localStorageSpy.getItem.and.callFake((key: string) => {
        if (key === 'jwt') return 'valid-token';
        if (key === 'userRole') return 'ROLE_ADMIN';
        return null;
      });
      mockState.url = '/organizer-dashboard';

      const result = TestBed.runInInjectionContext(() => 
        organizerGuard(mockRoute, mockState)
      );

      expect(result).toBe(true);
      expect(routerSpy.navigate).not.toHaveBeenCalled();
    });

    it('should redirect to home when token exists but role is ROLE_USER', () => {
      localStorageSpy.getItem.and.callFake((key: string) => {
        if (key === 'jwt') return 'valid-token';
        if (key === 'userRole') return 'ROLE_USER';
        return null;
      });
      mockState.url = '/organizer-dashboard';

      const result = TestBed.runInInjectionContext(() => 
        organizerGuard(mockRoute, mockState)
      );

      expect(result).toBe(false);
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/home']);
    });

    it('should redirect to home when role is undefined', () => {
      localStorageSpy.getItem.and.callFake((key: string) => {
        if (key === 'jwt') return 'valid-token';
        if (key === 'userRole') return null;
        return null;
      });
      mockState.url = '/organizer-dashboard';

      const result = TestBed.runInInjectionContext(() => 
        organizerGuard(mockRoute, mockState)
      );

      expect(result).toBe(false);
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/home']);
    });
  });

  // ============================================
  // TESTS - clientGuard
  // ============================================

  describe('clientGuard', () => {
    
    it('should redirect to client-signup when no token', () => {
      localStorageSpy.getItem.and.returnValue(null);
      mockState.url = '/my-tickets';

      const result = TestBed.runInInjectionContext(() => 
        clientGuard(mockRoute, mockState)
      );

      expect(result).toBe(false);
      expect(localStorageSpy.setItem).toHaveBeenCalledWith('redirectUrl', '/my-tickets');
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/client-signup']);
    });

    it('should allow access with valid token and ROLE_USER', () => {
      localStorageSpy.getItem.and.callFake((key: string) => {
        if (key === 'jwt') return 'valid-token';
        if (key === 'userRole') return 'ROLE_USER';
        return null;
      });
      mockState.url = '/my-tickets';

      const result = TestBed.runInInjectionContext(() => 
        clientGuard(mockRoute, mockState)
      );

      expect(result).toBe(true);
      expect(routerSpy.navigate).not.toHaveBeenCalled();
    });

    it('should redirect to home when token exists but role is ROLE_ADMIN', () => {
      localStorageSpy.getItem.and.callFake((key: string) => {
        if (key === 'jwt') return 'valid-token';
        if (key === 'userRole') return 'ROLE_ADMIN';
        return null;
      });
      mockState.url = '/my-tickets';

      const result = TestBed.runInInjectionContext(() => 
        clientGuard(mockRoute, mockState)
      );

      expect(result).toBe(false);
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/home']);
    });

    it('should redirect to home when role is undefined', () => {
      localStorageSpy.getItem.and.callFake((key: string) => {
        if (key === 'jwt') return 'valid-token';
        if (key === 'userRole') return null;
        return null;
      });
      mockState.url = '/my-tickets';

      const result = TestBed.runInInjectionContext(() => 
        clientGuard(mockRoute, mockState)
      );

      expect(result).toBe(false);
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/home']);
    });
  });

  // ============================================
  // TESTS - Edge Cases
  // ============================================

  describe('Edge Cases', () => {
    
    it('should handle empty token string', () => {
      localStorageSpy.getItem.and.returnValue('');
      mockState.url = '/organizer-dashboard';

      const result = TestBed.runInInjectionContext(() => 
        authGuard(mockRoute, mockState)
      );

      expect(result).toBe(false);
      expect(routerSpy.navigate).toHaveBeenCalled();
    });

    // it('should handle malformed URLs', () => {
    //   localStorageSpy.getItem.and.callFake((key: string) => {
    //     if (key === 'jwt') return 'valid-token';
    //     if (key === 'userRole') return 'ROLE_ADMIN';
    //     return null;
    //   });
    //   mockState.url = '//organizer-dashboard';

    //   const result = TestBed.runInInjectionContext(() => 
    //     authGuard(mockRoute, mockState)
    //   );

    //   // Should still work as startsWith checks the beginning
    //   expect(result).toBe(false); // Because URL doesn't start with /organizer
    // });
  });
});
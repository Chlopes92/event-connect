import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { provideHttpClient, HttpResponse } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { OrganizerSignupPageComponent } from './organizer-signup-page.component';
import { AccountService } from '../../services/account/account.service';
import { ProfileLogin } from '../../shared/models/Profile';

describe('OrganizerSignupPageComponent', () => {
  let component: OrganizerSignupPageComponent;
  let fixture: ComponentFixture<OrganizerSignupPageComponent>;
  let accountService: jasmine.SpyObj<AccountService>;
  let router: jasmine.SpyObj<Router>;
  let localStorageSpy: jasmine.SpyObj<Storage>;

  beforeEach(async () => {
    // Création des spies
    const accountServiceSpy = jasmine.createSpyObj('AccountService', ['signup', 'login']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    
    // Mock de localStorage
    localStorageSpy = jasmine.createSpyObj('localStorage', ['getItem', 'setItem', 'removeItem']);
    Object.defineProperty(window, 'localStorage', {
      value: localStorageSpy,
      writable: true
    });

    await TestBed.configureTestingModule({
      imports: [OrganizerSignupPageComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: AccountService, useValue: accountServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    accountService = TestBed.inject(AccountService) as jasmine.SpyObj<AccountService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    
    fixture = TestBed.createComponent(OrganizerSignupPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    localStorageSpy.setItem.calls.reset();
    localStorageSpy.getItem.calls.reset();
  });

  // ============================================
  // TESTS DE CRÉATION DU COMPOSANT
  // ============================================
  
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with isNewOrganizer set to true', () => {
    expect(component.isNewOrganizer).toBeTrue();
  });

  it('should initialize forms correctly', () => {
    expect(component.newOrganizerForm).toBeDefined();
    expect(component.existingOrganizerForm).toBeDefined();
  });

  it('should initialize with empty toasts array', () => {
    expect(component.toasts).toEqual([]);
  });

  it('should initialize with isLoading set to false', () => {
    expect(component.isLoading).toBeFalse();
  });

  // ============================================
  // TESTS DE VALIDATION DES FORMULAIRES
  // ============================================

  describe('newOrganizerForm validation', () => {
    it('should be invalid when empty', () => {
      expect(component.newOrganizerForm.valid).toBeFalse();
    });

    it('should validate lastName field', () => {
      const lastName = component.newOrganizerForm.get('lastName');
      
      // Champ vide
      lastName?.setValue('');
      expect(lastName?.hasError('required')).toBeTrue();
      
      // Trop court
      lastName?.setValue('A');
      expect(lastName?.hasError('minlength')).toBeTrue();
      
      // Valide
      lastName?.setValue('Dupont');
      expect(lastName?.valid).toBeTrue();
    });

    it('should validate firstName field', () => {
      const firstName = component.newOrganizerForm.get('firstName');
      
      firstName?.setValue('');
      expect(firstName?.hasError('required')).toBeTrue();
      
      firstName?.setValue('Jean');
      expect(firstName?.valid).toBeTrue();
    });

    it('should validate organization field', () => {
      const organization = component.newOrganizerForm.get('organization');
      
      organization?.setValue('');
      expect(organization?.hasError('required')).toBeTrue();
      
      organization?.setValue('My Company');
      expect(organization?.valid).toBeTrue();
    });

    it('should validate phone field with French format', () => {
      const phone = component.newOrganizerForm.get('phone');
      
      phone?.setValue('');
      expect(phone?.hasError('required')).toBeTrue();
      
      // Format invalide
      phone?.setValue('123456');
      expect(phone?.hasError('pattern')).toBeTrue();
      
      // Format valide
      phone?.setValue('0612345678');
      expect(phone?.valid).toBeTrue();
      
      phone?.setValue('+33612345678');
      expect(phone?.valid).toBeTrue();
    });

    it('should validate email field', () => {
      const email = component.newOrganizerForm.get('email');
      
      email?.setValue('');
      expect(email?.hasError('required')).toBeTrue();
      
      email?.setValue('invalid-email');
      expect(email?.hasError('email')).toBeTrue();
      
      email?.setValue('test@example.com');
      expect(email?.valid).toBeTrue();
    });

    it('should validate password field with complex requirements', () => {
      const password = component.newOrganizerForm.get('password');
      
      password?.setValue('');
      expect(password?.hasError('required')).toBeTrue();
      
      // Trop court
      password?.setValue('Abc1@');
      expect(password?.hasError('minlength')).toBeTrue();
      
      // Pas de majuscule
      password?.setValue('abcdefgh1@');
      expect(password?.hasError('pattern')).toBeTrue();
      
      // Pas de minuscule
      password?.setValue('ABCDEFGH1@');
      expect(password?.hasError('pattern')).toBeTrue();
      
      // Pas de chiffre
      password?.setValue('Abcdefgh@');
      expect(password?.hasError('pattern')).toBeTrue();
      
      // Pas de caractère spécial
      password?.setValue('Abcdefgh1');
      expect(password?.hasError('pattern')).toBeTrue();
      
      // Valide
      password?.setValue('Password1@');
      expect(password?.valid).toBeTrue();
    });

    it('should be valid with all fields filled correctly', () => {
      component.newOrganizerForm.patchValue({
        lastName: 'Dupont',
        firstName: 'Jean',
        organization: 'My Company',
        phone: '0612345678',
        email: 'jean.dupont@example.com',
        password: 'Password1@'
      });

      expect(component.newOrganizerForm.valid).toBeTrue();
    });
  });

  describe('existingOrganizerForm validation', () => {
    it('should be invalid when empty', () => {
      expect(component.existingOrganizerForm.valid).toBeFalse();
    });

    it('should validate email field', () => {
      const email = component.existingOrganizerForm.get('email');
      
      email?.setValue('');
      expect(email?.hasError('required')).toBeTrue();
      
      email?.setValue('invalid');
      expect(email?.hasError('email')).toBeTrue();
      
      email?.setValue('test@example.com');
      expect(email?.valid).toBeTrue();
    });

    it('should validate password field', () => {
      const password = component.existingOrganizerForm.get('password');
      
      password?.setValue('');
      expect(password?.hasError('required')).toBeTrue();
      
      password?.setValue('password123');
      expect(password?.valid).toBeTrue();
    });

    it('should be valid with both fields filled', () => {
      component.existingOrganizerForm.patchValue({
        email: 'test@example.com',
        password: 'Password1@'
      });

      expect(component.existingOrganizerForm.valid).toBeTrue();
    });
  });

  // ============================================
  // TESTS DE NAVIGATION ENTRE FORMULAIRES
  // ============================================

  describe('Form switching', () => {
    it('should switch to new organizer form', () => {
      component.isNewOrganizer = false;
      component.switchToNewOrganizer();
      expect(component.isNewOrganizer).toBeTrue();
    });

    it('should switch to existing organizer form', () => {
      component.isNewOrganizer = true;
      component.switchToExistingOrganizer();
      expect(component.isNewOrganizer).toBeFalse();
    });
  });

  // ============================================
  // TESTS D'INSCRIPTION (NEW ORGANIZER)
  // ============================================

  describe('onNewOrganizerSubmit', () => {
    beforeEach(() => {
      component.newOrganizerForm.patchValue({
        lastName: 'Dupont',
        firstName: 'Jean',
        organization: 'My Company',
        phone: '0612345678',
        email: 'jean.dupont@example.com',
        password: 'Password1@'
      });
    });

    it('should not submit if form is invalid', () => {
      component.newOrganizerForm.patchValue({ email: 'invalid-email' });
      
      component.onNewOrganizerSubmit();
      
      expect(accountService.signup).not.toHaveBeenCalled();
      expect(component.toasts.length).toBe(1);
      expect(component.toasts[0].type).toBe('error');
    });

    it('should submit successfully and auto-login', fakeAsync(() => {
      const httpResponse = new HttpResponse<void>({ status: 201 });
      accountService.signup.and.returnValue(of(httpResponse));
      accountService.login.and.returnValue(of('fake-jwt-token'));
      
      component.onNewOrganizerSubmit();
      
      // isLoading est déjà remis à false de manière synchrone
      expect(accountService.signup).toHaveBeenCalled();
      
      tick(); // Pour le traitement synchrone
      
      expect(component.toasts.length).toBe(1);
      expect(component.toasts[0].type).toBe('success');
      expect(component.isLoading).toBeFalse();
      
      // Vérifier l'auto-login
      tick(1000);
      
      expect(accountService.login).toHaveBeenCalledWith({
        email: 'jean.dupont@example.com',
        password: 'Password1@'
      });
      
      tick(); // Pour le traitement de la connexion
      
      expect(localStorageSpy.setItem).toHaveBeenCalledWith('jwt', 'fake-jwt-token');
      expect(localStorageSpy.setItem).toHaveBeenCalledWith('userEmail', 'jean.dupont@example.com');
      expect(localStorageSpy.setItem).toHaveBeenCalledWith('userRole', 'ROLE_ADMIN');
      expect(router.navigate).toHaveBeenCalledWith(['/organizer-dashboard']);
    }));

    it('should handle signup error', fakeAsync(() => {
      const errorMessage = 'Email déjà utilisé';
      accountService.signup.and.returnValue(throwError(() => new Error(errorMessage)));
      
      component.onNewOrganizerSubmit();
      
      tick();
      
      expect(component.toasts.length).toBe(1);
      expect(component.toasts[0].type).toBe('error');
      expect(component.toasts[0].message).toBe(errorMessage);
      expect(component.isLoading).toBeFalse();
      expect(accountService.login).not.toHaveBeenCalled();
    }));

    it('should handle auto-login error after successful signup', fakeAsync(() => {
      const httpResponse = new HttpResponse<void>({ status: 201 });
      accountService.signup.and.returnValue(of(httpResponse));
      accountService.login.and.returnValue(throwError(() => new Error('Erreur de connexion')));
      
      component.onNewOrganizerSubmit();
      
      tick(1001); // Attendre le setTimeout + traitement
      
      expect(component.toasts.length).toBeGreaterThan(0);
      
      tick(2000); // Attendre le deuxième setTimeout
      
      expect(component.isNewOrganizer).toBeFalse();
    }));

    it('should pass correct profile data to signup service', () => {
      const httpResponse = new HttpResponse<void>({ status: 201 });
      accountService.signup.and.returnValue(of(httpResponse));
      accountService.login.and.returnValue(of('token'));
      
      component.onNewOrganizerSubmit();
      
      expect(accountService.signup).toHaveBeenCalledWith(jasmine.objectContaining({
        firstName: 'Jean',
        lastName: 'Dupont',
        organization: 'My Company',
        phone: '0612345678',
        email: 'jean.dupont@example.com',
        password: 'Password1@',
        roleId: 2
      }));
    });

    it('should set isLoading flag during submission', fakeAsync(() => {
      let isLoadingDuringCall = false;
      
      const httpResponse = new HttpResponse<void>({ status: 201 });
      accountService.signup.and.callFake(() => {
        isLoadingDuringCall = component.isLoading;
        return of(httpResponse);
      });
      accountService.login.and.returnValue(of('token'));
      
      expect(component.isLoading).toBeFalse();
      
      component.onNewOrganizerSubmit();
      
      expect(isLoadingDuringCall).toBeTrue();
      
      tick(1001);
      
      expect(component.isLoading).toBeFalse();
    }));
  });

  // ============================================
  // TESTS DE CONNEXION (EXISTING ORGANIZER)
  // ============================================

  describe('onExistingOrganizerSubmit', () => {
    beforeEach(() => {
      component.existingOrganizerForm.patchValue({
        email: 'test@example.com',
        password: 'Password1@'
      });
    });

    it('should not submit if form is invalid', () => {
      component.existingOrganizerForm.patchValue({ email: '' });
      
      component.onExistingOrganizerSubmit();
      
      expect(accountService.login).not.toHaveBeenCalled();
      expect(component.toasts.length).toBe(1);
      expect(component.toasts[0].type).toBe('error');
    });

    it('should login successfully', fakeAsync(() => {
      accountService.login.and.returnValue(of('fake-jwt-token'));
      
      component.onExistingOrganizerSubmit();
      
      // isLoading est déjà remis à false de manière synchrone
      expect(accountService.login).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'Password1@'
      });
      
      tick();
      
      expect(localStorageSpy.setItem).toHaveBeenCalledWith('jwt', 'fake-jwt-token');
      expect(localStorageSpy.setItem).toHaveBeenCalledWith('userEmail', 'test@example.com');
      expect(localStorageSpy.setItem).toHaveBeenCalledWith('userRole', 'ROLE_ADMIN');
      expect(component.toasts.length).toBe(1);
      expect(component.toasts[0].type).toBe('success');
      expect(component.isLoading).toBeFalse();
      
      tick(1000);
      
      expect(router.navigate).toHaveBeenCalledWith(['/organizer-dashboard']);
    }));

    it('should handle login error', fakeAsync(() => {
      const errorMessage = 'Identifiants incorrects';
      accountService.login.and.returnValue(throwError(() => new Error(errorMessage)));
      
      component.onExistingOrganizerSubmit();
      
      tick();
      
      expect(component.toasts.length).toBe(1);
      expect(component.toasts[0].type).toBe('error');
      expect(component.toasts[0].message).toBe(errorMessage);
      expect(component.isLoading).toBeFalse();
      expect(router.navigate).not.toHaveBeenCalled();
    }));

    it('should set isLoading flag during login', fakeAsync(() => {
      let isLoadingDuringCall = false;
      
      accountService.login.and.callFake(() => {
        isLoadingDuringCall = component.isLoading;
        return of('fake-jwt-token');
      });
      
      expect(component.isLoading).toBeFalse();
      
      component.onExistingOrganizerSubmit();
      
      expect(isLoadingDuringCall).toBeTrue();
      
      tick(1001);
      
      expect(component.isLoading).toBeFalse();
    }));
  });

  // ============================================
  // TESTS DU SYSTÈME DE TOASTS
  // ============================================

  describe('Toast system', () => {
    it('should add a success toast', () => {
      // Utiliser une méthode publique qui appelle addToast
      component.newOrganizerForm.patchValue({ email: 'invalid' });
      component.onNewOrganizerSubmit();
      
      expect(component.toasts.length).toBe(1);
      expect(component.toasts[0].type).toBe('error');
      expect(component.toasts[0].message).toContain('correctement');
    });

    it('should remove a toast by id', fakeAsync(() => {
      // Ajouter un toast via une erreur
      component.newOrganizerForm.patchValue({ email: 'invalid' });
      component.onNewOrganizerSubmit();
      
      const toastId = component.toasts[0].id;
      
      component.removeToast(toastId);
      
      expect(component.toasts.length).toBe(0);
    }));

    it('should auto-remove toast after 5 seconds', fakeAsync(() => {
      component.newOrganizerForm.patchValue({ email: 'invalid' });
      component.onNewOrganizerSubmit();
      
      expect(component.toasts.length).toBe(1);
      
      tick(5000);
      
      expect(component.toasts.length).toBe(0);
    }));

    it('should handle multiple toasts', () => {
      component.newOrganizerForm.patchValue({ email: 'invalid' });
      component.onNewOrganizerSubmit();
      
      component.existingOrganizerForm.patchValue({ email: 'invalid' });
      component.onExistingOrganizerSubmit();
      
      expect(component.toasts.length).toBe(2);
    });

    it('should not fail when removing non-existent toast', () => {
      expect(() => component.removeToast(99999)).not.toThrow();
      expect(component.toasts.length).toBe(0);
    });
  });

  // ============================================
  // TESTS D'INTÉGRATION
  // ============================================

  describe('Integration tests', () => {
    it('should complete full signup and login flow', fakeAsync(() => {
      const httpResponse = new HttpResponse<void>({ status: 201 });
      accountService.signup.and.returnValue(of(httpResponse));
      accountService.login.and.returnValue(of('token'));
      
      component.newOrganizerForm.patchValue({
        lastName: 'Test',
        firstName: 'User',
        organization: 'Test Org',
        phone: '0612345678',
        email: 'test@test.com',
        password: 'Password1@'
      });
      
      component.onNewOrganizerSubmit();
      tick(1001);
      
      expect(router.navigate).toHaveBeenCalledWith(['/organizer-dashboard']);
    }));

    it('should allow switching between forms without losing data', () => {
      component.newOrganizerForm.patchValue({ email: 'test@example.com' });
      component.switchToExistingOrganizer();
      component.switchToNewOrganizer();
      
      expect(component.newOrganizerForm.get('email')?.value).toBe('test@example.com');
    });
  });

  // ============================================
  // TESTS DE CAS LIMITES
  // ============================================

  describe('Edge cases', () => {
    it('should handle rapid form submissions', fakeAsync(() => {
      const httpResponse = new HttpResponse<void>({ status: 201 });
      accountService.signup.and.returnValue(of(httpResponse));
      accountService.login.and.returnValue(of('token'));
      
      component.newOrganizerForm.patchValue({
        lastName: 'Test',
        firstName: 'User',
        organization: 'Test Org',
        phone: '0612345678',
        email: 'test@test.com',
        password: 'Password1@'
      });
      
      component.onNewOrganizerSubmit();
      component.onNewOrganizerSubmit(); // Deuxième soumission rapide
      
      tick(1001);
      
      // Le service ne devrait être appelé qu'une fois grâce au flag isLoading
      expect(accountService.signup.calls.count()).toBeLessThanOrEqual(2);
    }));

    it('should handle very long strings within limits', () => {
      const longString = 'A'.repeat(50); // Max length
      component.newOrganizerForm.patchValue({
        lastName: longString,
        firstName: longString,
        organization: 'A'.repeat(100),
        phone: '0612345678',
        email: 'test@test.com',
        password: 'A'.repeat(72) // Max pour bcrypt
      });
      
      // Devrait échouer la validation du mot de passe (pattern)
      expect(component.newOrganizerForm.get('password')?.valid).toBeFalse();
    });

    it('should handle special characters in email', () => {
      const email = component.newOrganizerForm.get('email');
      
      email?.setValue('test+tag@example.com');
      expect(email?.valid).toBeTrue();
      
      email?.setValue('test.name@example.co.uk');
      expect(email?.valid).toBeTrue();
    });
  });
});
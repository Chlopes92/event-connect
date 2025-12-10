import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AccountService } from '../../services/account/account.service';
import { ProfileLogin } from '../../shared/models/Profile';

/**
 * Toast Interface
 */
interface Toast {
  id: number;
  type: 'success' | 'error' | 'warning';
  message: string;
}

@Component({
  selector: 'app-organizer-signup-page',
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './organizer-signup-page.component.html',
  styleUrl: './organizer-signup-page.component.css'
})
export class OrganizerSignupPageComponent {
  isNewOrganizer = true;
  newOrganizerForm: FormGroup;
  existingOrganizerForm: FormGroup;
  
  // Système de toasts
  toasts: Toast[] = [];
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder, 
    private router: Router, 
    private accountService: AccountService
  ) {
    this.newOrganizerForm = this.fb.group({
      lastName: ['', Validators.required],
      firstName: ['', Validators.required],
      organization: ['', Validators.required],
      phone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });

    this.existingOrganizerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  switchToNewOrganizer() {
    this.isNewOrganizer = true;
  }

  switchToExistingOrganizer() {
    this.isNewOrganizer = false;
  }

  /**
   * INSCRIPTION - Création d'un nouvel organisateur
   */
  onNewOrganizerSubmit() {
    if (this.newOrganizerForm.invalid) {
      this.addToast('error', 'Veuillez remplir tous les champs correctement ⚠️');
      return;
    }

    this.isLoading = true;
    const formValue = this.newOrganizerForm.value;

    const profile = {
      firstName: formValue.firstName,
      lastName: formValue.lastName,
      organization: formValue.organization,
      phone: formValue.phone,
      email: formValue.email,
      password: formValue.password,
      roleId: 2 // ROLE_ADMIN 
    };

    this.accountService.signup(profile).subscribe({
      next: (response) => {
        this.addToast('success', '🎉 Inscription réussie ! Connexion en cours...');
        
        // Connexion automatique après inscription
        const credentials: ProfileLogin = {
          email: formValue.email,
          password: formValue.password
        };

        setTimeout(() => {
          this.accountService.login(credentials).subscribe({
            next: (token) => {
              localStorage.setItem('jwt', token);
              localStorage.setItem('userEmail', formValue.email);
              localStorage.setItem('userRole', 'ROLE_ADMIN');
              
              this.router.navigate(['/organizer-dashboard']);
            },
            error: (error: Error) => {
              console.error('❌ Erreur de connexion automatique:', error.message);
              this.addToast('success', 'Inscription réussie ! Veuillez vous connecter 👇');
              setTimeout(() => {
                this.switchToExistingOrganizer();
              }, 2000);
            }
          });
        }, 1000);

        this.isLoading = false;
      },
      error: (error: Error) => {
        console.error('❌ Erreur lors de l\'inscription:', error.message);
        this.addToast('error', error.message);
        this.isLoading = false;
      }
    });
  }

  /**
   * CONNEXION - Organisateur existant
   */
  onExistingOrganizerSubmit() {
    if (this.existingOrganizerForm.invalid) {
      this.addToast('error', 'Veuillez remplir tous les champs ⚠️');
      return;
    }

    this.isLoading = true;
    const credentials: ProfileLogin = this.existingOrganizerForm.value;

    this.accountService.login(credentials).subscribe({
      next: (token) => {
        localStorage.setItem('jwt', token);
        localStorage.setItem('userEmail', credentials.email);
        localStorage.setItem('userRole', 'ROLE_ADMIN');

        this.addToast('success', '🎉 Connexion réussie ! Redirection...');
        
        setTimeout(() => {
          this.router.navigate(['/organizer-dashboard']);
        }, 1000);

        this.isLoading = false;
      },
      error: (error: Error) => {
        console.error('❌ Erreur de connexion:', error.message);
        this.addToast('error', error.message);
        this.isLoading = false;
      }
    });
  }

  /**
   * Ajouter un toast
   */
  private addToast(type: 'success' | 'error' | 'warning', message: string): void {
    const toast: Toast = {
      id: Date.now(),
      type,
      message
    };
    this.toasts.push(toast);
    
    // Auto-suppression après 5 secondes
    setTimeout(() => this.removeToast(toast.id), 5000);
  }

  /**
   * Supprimer un toast
   */
  removeToast(id: number): void {
    this.toasts = this.toasts.filter(toast => toast.id !== id);
  }
}